<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User; // لو هتسجل بيانات في جدول users

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

        // حفظ البيانات في قاعدة البيانات
        User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => bcrypt($validatedData['password']),
        ]);

        return redirect()->back()->with('success', 'تم إضافة المستخدم بنجاح!');
    }
}