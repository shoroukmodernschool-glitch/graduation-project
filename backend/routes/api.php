<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FirebaseController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ✅ Route للتجربة (بيأكد إن التوكن واصل)
Route::get('/test', function (Request $request) {
    return response()->json([
        'full_header' => $request->header('Authorization'),
        'bearer_token' => $request->bearerToken(),
    ]);
});

// ✅ Login
Route::post('/login', [AuthController::class, 'login']);

// ✅ Register (اللي ضفناه دلوقتي)
Route::post('/register', [AuthController::class, 'register']);

// ✅ Verify Firebase Token
Route::post('/verify-token', [FirebaseController::class, 'verifyToken']);

// 🔥 Route محمي بالـ Firebase
Route::middleware('firebase.auth')->get('/protected', function (Request $request) {
    return response()->json([
        'message' => 'Authorized ✅',
        'uid' => $request->attributes->get('firebase_uid')
    ]);
});