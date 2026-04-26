<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FirebaseController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\SignupOtpController;
use App\Http\Controllers\Auth\LoginSecurityController;
use App\Http\Controllers\Auth\AdminOtpController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\AttendanceController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::get('/test', function (Request $request) {
    return response()->json([
        'full_header' => $request->header('Authorization'),
        'bearer_token' => $request->bearerToken(),
    ]);
});

Route::middleware('activity.log')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/verify-token', [FirebaseController::class, 'verifyToken']);

    Route::post('/forgot-password/send-code', [ForgotPasswordController::class, 'sendCode']);
    Route::post('/forgot-password/verify-code', [ForgotPasswordController::class, 'verifyCode']);
    Route::post('/forgot-password/reset-password', [ForgotPasswordController::class, 'resetPassword']);

    Route::post('/signup/send-otp', [SignupOtpController::class, 'sendOtp']);
    Route::post('/signup/resend-otp', [SignupOtpController::class, 'resendOtp']);
    Route::post('/signup/verify-otp', [SignupOtpController::class, 'verifyOtp']);

    Route::post('/admin/send-login-otp', [AdminOtpController::class, 'sendOtp']);
    Route::post('/admin/verify-login-otp', [AdminOtpController::class, 'verifyOtp']);

    Route::post('/login/check-lock', [LoginSecurityController::class, 'checkLock']);
    Route::post('/login/record-failed', [LoginSecurityController::class, 'recordFailed']);
    Route::post('/login/clear-attempts', [LoginSecurityController::class, 'clearAttempts']);

    Route::post('/chatbot/message', [ChatbotController::class, 'sendMessage']);
    Route::post('/attendance/mark', [AttendanceController::class, 'markAttendance']);
});

Route::middleware(['firebase.auth', 'activity.log'])->get('/protected', function (Request $request) {
    return response()->json([
        'message' => 'Authorized ✅',
        'uid' => $request->attributes->get('firebase_uid')
    ]);
});