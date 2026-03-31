<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FirebaseController;

// 🔐 Login (حماية قوية ضد السبام)
Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:2,1'); // 2 requests في الدقيقة

// 🔐 Verify Token (حماية أخف شوية)
Route::post('/verify-token', [FirebaseController::class, 'verifyToken'])
    ->middleware('throttle:5,1'); // 5 requests في الدقيقة

// 🧪 Endpoint للتجربة من المتصفح
Route::get('/test', function () {
    return response()->json([
        'message' => 'API is working 🔥'
    ]);
})->middleware('throttle:2,1'); // 2 requests بس