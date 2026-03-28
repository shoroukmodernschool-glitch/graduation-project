<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\TestFirebaseController;

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
| Firebase Test Route
|--------------------------------------
*/
Route::get('/firebase-test', [TestFirebaseController::class, 'test']);

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

    // هنا ممكن تحط authentication حقيقي بعدين
    // دلوقتي مجرد محاكاة للـ login
    session(['student_id' => $request->student_id]); // حفظ session
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
    Auth::logout();                    // لو عندك Auth
    $request->session()->invalidate(); // يمسح session
    $request->session()->regenerateToken(); // يجدد CSRF token
    return redirect('/');              // رجوع للـ home
});

/*
|--------------------------------------
| Protected Routes (بعد login)
|--------------------------------------
*/
Route::group(['middleware' => ['noBackHistory']], function () {

    Route::get('/dashboard', function () {
        // هنا تحط view بتاعت dashboard
        return view('dashboard');
    });

    Route::get('/profile', function () {
        return view('profile');
    });

});