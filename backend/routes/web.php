<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\TestFirebaseController;
use App\Http\Controllers\FirebaseController;
use Kreait\Firebase\Factory;

/*
|--------------------------------------
| Home Route
|--------------------------------------
*/
Route::get('/', function () {
    return view('welcome');
});

/*
|--------------------------------------
| Test Firebase JSON File
|--------------------------------------
*/
Route::get('/test-file', function () {
    return file_exists(storage_path('firebase/firebase_credentials.json')) 
        ? 'Found' 
        : 'Not Found';
});

/*
|--------------------------------------
| Firebase Test Routes
|--------------------------------------
*/
// باستخدام TestFirebaseController
Route::get('/firebase-test', [TestFirebaseController::class, 'test']);

// باستخدام Factory مباشرة
Route::get('/firebase-factory', function () {
    $factory = (new Factory)
        ->withServiceAccount(config('firebase.credentials'));

    $auth = $factory->createAuth();

    return "Firebase connected successfully 🚀";
});

/*
|--------------------------------------
| Verify Firebase Token 🔥
|--------------------------------------
*/
Route::post('/verify-token', [TestFirebaseController::class, 'verifyToken']);

/*
|--------------------------------------
| Test Login Route (for React)
|--------------------------------------
*/
Route::post('/login', function (Request $request) {
    session(['student_id' => $request->student_id]); 
    return response()->json([
        "status" => "success",
        "student" => [
            "id" => $request->student_id
        ]
    ]);
});

/*
|--------------------------------------
| Logout Route
|--------------------------------------
*/
Route::get('/logout', function (Request $request) {
    Auth::logout();                    
    $request->session()->invalidate(); 
    $request->session()->regenerateToken(); 
    return redirect('/');              
});

/*
|--------------------------------------
| Protected Routes (بعد login)
|--------------------------------------
*/
Route::group(['middleware' => ['noBackHistory']], function () {

    Route::get('/dashboard', function () {
        return view('dashboard');
    });

    Route::get('/profile', function () {
        return view('profile');
    });

});