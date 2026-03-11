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