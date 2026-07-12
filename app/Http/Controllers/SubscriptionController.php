<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Midtrans\Config;
use Midtrans\Snap;
use Carbon\Carbon;

class SubscriptionController extends Controller
{
    public function __construct()
    {
        // Konfigurasi Midtrans dari environment variables
        Config::$serverKey = env('MIDTRANS_SERVER_KEY');
        Config::$isProduction = env('MIDTRANS_IS_PRODUCTION', false);
        Config::$isSanitized = true;
        Config::$is3ds = true;
    }

    /**
     * Tampilkan Halaman Penawaran Paket Langganan
     */
    public function index()
    {
        return Inertia::render('Public/Subscription');
    }

    /**
     * Menerima request pemilihan paket dari user yang login
     * Generate Snap Token dari Midtrans
     */
    public function checkout(Request $request)
    {
        $user = $request->user();
        
        // Buat Order ID unik
        $orderId = 'SUB-' . $user->id . '-' . time();
        $grossAmount = 50000; // Harga paket: Rp 50.000

        // 1. Simpan kerangka transaksi ke database dengan status 'pending'
        Subscription::create([
            'user_id' => $user->id,
            'midtrans_transaction_id' => $orderId,
            'package_type' => 'monthly',
            'status' => 'pending',
            'start_date' => Carbon::now(),
            'end_date' => Carbon::now()->addMonth(),
        ]);

        // 2. Siapkan parameter untuk Midtrans
        $params = [
            'transaction_details' => [
                'order_id' => $orderId,
                'gross_amount' => $grossAmount,
            ],
            'customer_details' => [
                'first_name' => $user->name,
                'email' => $user->email,
            ],
            'item_details' => [
                [
                    'id' => 'PREMIUM-1M',
                    'price' => $grossAmount,
                    'quantity' => 1,
                    'name' => 'Paket Premium 1 Bulan'
                ]
            ]
        ];

        try {
            // 3. Generate Snap Token
            $snapToken = Snap::getSnapToken($params);
            
            // Kembalikan token ke frontend React
            return response()->json(['token' => $snapToken]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Endpoint API Webhook untuk menerima Callback dari Midtrans
     */
    public function webhook(Request $request)
    {
        $notif = $request->all();
        
        $transactionStatus = $notif['transaction_status'];
        $orderId = $notif['order_id'];

        $subscription = Subscription::where('midtrans_transaction_id', $orderId)->first();

        if (!$subscription) {
            return response()->json(['message' => 'Transaksi tidak ditemukan'], 404);
        }

        // Cek status pembayaran
        if ($transactionStatus == 'capture' || $transactionStatus == 'settlement') {
            // Berhasil dibayar
            $subscription->update([
                'status' => 'active'
            ]);

            // Update role user menjadi 'subscriber'
            $user = User::find($subscription->user_id);
            if ($user && $user->role == 'guest') {
                $user->update(['role' => 'subscriber']);
            }

        } else if ($transactionStatus == 'cancel' || $transactionStatus == 'deny' || $transactionStatus == 'expire') {
            // Gagal / Expired
            $subscription->update([
                'status' => 'failed'
            ]);
        } else if ($transactionStatus == 'pending') {
            // Menunggu pembayaran
            $subscription->update([
                'status' => 'pending'
            ]);
        }

        return response()->json(['message' => 'Webhook Midtrans berhasil diproses']);
    }
}
