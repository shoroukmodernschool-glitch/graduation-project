<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::get('/', function () {
    return view('welcome');
});

/*
|--------------------------------------
| Test Login Route (for React)
|--------------------------------------
*/

Route::post('/login', function (Request $request) {

    return response()->json([
        "status" => "success",
        "student" => [
            "id" => $request->student_id
        ]
    ]);

});
use App\Http\Controllers\FirebaseController;

Route::get('/firebase-test', [FirebaseController::class, 'test']);

use Kreait\Firebase\Factory;

Route::get('/firebase-test', function () {
    $factory = (new Factory)
        ->withServiceAccount(config('firebase.credentials'));

    $auth = $factory->createAuth();

    return "Firebase connected successfully 🚀";
});