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

Route::post('/login', [AuthController::class, 'login']);

Route::post('/verify-token', [FirebaseController::class, 'verifyToken']);

// 🔥 Route محمي بالـ Firebase
Route::middleware('firebase.auth')->get('/test', function (Request $request) {
    return response()->json([
        'message' => 'Authorized ✅',
        'uid' => $request->attributes->get('firebase_uid')
    ]);
});