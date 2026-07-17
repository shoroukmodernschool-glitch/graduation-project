<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User; //  users

class UserController extends Controller
{
    public function store(Request $request)
    {
        // Validation
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed',
        ]);

        //
        User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => bcrypt($validatedData['password']),
        ]);

        return redirect()->back()->with('success', 'تم إضافة المستخدم بنجاح!');
    }
}