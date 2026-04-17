<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FirebaseController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\SignupOtpController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ✅ Route للتجربة
Route::get('/test', function (Request $request) {
    return response()->json([
        'full_header' => $request->header('Authorization'),
        'bearer_token' => $request->bearerToken(),
    ]);
});

// ✅ Login
Route::post('/login', [AuthController::class, 'login']);

// ✅ Register
Route::post('/register', [AuthController::class, 'register']);

// ✅ Verify Firebase Token
Route::post('/verify-token', [FirebaseController::class, 'verifyToken']);

// ✅ Forgot Password - Send Code
Route::post('/forgot-password/send-code', [ForgotPasswordController::class, 'sendCode']);

// ✅ Forgot Password - Verify Code
Route::post('/forgot-password/verify-code', [ForgotPasswordController::class, 'verifyCode']);

// ✅ Forgot Password - Reset Password
Route::post('/forgot-password/reset-password', [ForgotPasswordController::class, 'resetPassword']);

// ✅ Signup OTP
Route::post('/signup/send-otp', [SignupOtpController::class, 'sendOtp']);
Route::post('/signup/resend-otp', [SignupOtpController::class, 'resendOtp']);
Route::post('/signup/verify-otp', [SignupOtpController::class, 'verifyOtp']);

// 🔥 Route محمي بالـ Firebase
Route::middleware('firebase.auth')->get('/protected', function (Request $request) {
    return response()->json([
        'message' => 'Authorized ✅',
        'uid' => $request->attributes->get('firebase_uid')
    ]);
});