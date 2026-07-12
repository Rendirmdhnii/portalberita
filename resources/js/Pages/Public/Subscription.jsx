import React, { useEffect } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';

export default function Subscription({ auth }) {
    const user = auth?.user;

    // Load Midtrans Snap Script
    useEffect(() => {
        // We use sandbox URL for development
        const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
        // Ganti dengan Client Key asli dari Dashboard Midtrans Anda
        const clientKey = "SB-Mid-client-DUMMY123";

        const script = document.createElement('script');
        script.src = snapScript;
        script.setAttribute('data-client-key', clientKey);
        script.async = true;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleCheckout = async () => {
        if (!user) {
            alert('Silakan masuk (login) terlebih dahulu untuk berlangganan.');
            window.location.href = '/login';
            return;
        }

        try {
            // Memanggil endpoint backend untuk mendapatkan Snap Token
            const response = await axios.post('/api/langganan/checkout');
            const snapToken = response.data.token;

            // Membuka popup Snap Midtrans
            window.snap.pay(snapToken, {
                onSuccess: function(result) {
                    alert("Pembayaran Berhasil! Halaman akan dimuat ulang.");
                    window.location.href = '/dashboard';
                },
                onPending: function(result) {
                    alert("Menunggu pembayaran Anda.");
                },
                onError: function(result) {
                    alert("Pembayaran Gagal.");
                },
                onClose: function() {
                    // User closed the popup
                }
            });
        } catch (error) {
            console.error(error);
            alert('Terjadi kesalahan saat memproses permintaan Anda.');
        }
    };

    return (
        <PublicLayout user={auth?.user}>
            <Head title="Berlangganan Premium - PojokTV" />

            <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black text-gray-900 mb-4">Akses Tanpa Batas ke Konten Jurnalistik Eksklusif</h1>
                    <p className="text-lg text-gray-600">Dukung jurnalisme independen dan nikmati berita mendalam tanpa gangguan iklan.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transform transition hover:scale-105 duration-300">
                    <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-8 text-center text-white">
                        <span className="bg-blue-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full mb-4 inline-block">Paket Terpopuler</span>
                        <h2 className="text-3xl font-bold mb-2">Premium Bulanan</h2>
                        <div className="flex justify-center items-end mt-4 mb-2">
                            <span className="text-5xl font-black">Rp 50.000</span>
                            <span className="text-blue-200 ml-2 mb-1">/ bulan</span>
                        </div>
                    </div>
                    
                    <div className="p-8">
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center">
                                <svg className="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                <span className="text-gray-700">Akses seluruh artikel premium & eksklusif</span>
                            </li>
                            <li className="flex items-center">
                                <svg className="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                <span className="text-gray-700">Bebas dari iklan (100% Ad-free)</span>
                            </li>
                            <li className="flex items-center">
                                <svg className="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                <span className="text-gray-700">Dukung jurnalisme berkualitas</span>
                            </li>
                        </ul>

                        <button 
                            onClick={handleCheckout}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition duration-200 transform hover:-translate-y-1"
                        >
                            {user ? 'Berlangganan Sekarang' : 'Login & Berlangganan Sekarang'}
                        </button>
                        
                        <p className="text-center text-xs text-gray-400 mt-4">
                            Pembayaran aman diproses oleh Midtrans. Bisa bayar via GoPay, BCA, Mandiri, dll.
                        </p>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
