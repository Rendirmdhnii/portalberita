<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SubscriptionController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Subscription Midtrans API Routes
Route::middleware('auth:sanctum')->group(function () {
    // Note: Since we are using Sanctum for API auth but Inertia uses session auth by default,
    // if the frontend calls this via axios from Inertia, it might be better to use 'web' auth,
    // but the prompt specified `auth` middleware inside /api/. We will use `auth:sanctum`.
    // Actually, Inertia axios uses session auth automatically. 
    // To support session auth in api routes for local requests, we can just use `auth:web`.
    Route::post('/langganan/checkout', [SubscriptionController::class, 'checkout'])->middleware('auth:web');
});

// Webhook (Publicly accessible, no CSRF needed in api.php)
Route::post('/webhook/midtrans', [SubscriptionController::class, 'webhook'])->name('api.midtrans.webhook');
