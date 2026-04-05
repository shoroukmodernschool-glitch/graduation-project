<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Notifications\WelcomeNotification;
use Illuminate\Support\Facades\Notification;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // التحقق من القيم
        if (!$request->student_id || !$request->password) {
            return response()->json([
                "status" => "error",
                "message" => "ID and Password required"
            ]);
        }

        // البحث عن الطالب
        $student = DB::table('students') // ✅ عدلنا هنا
            ->where('student_id', $request->student_id)
            ->first();

        if (!$student) {
            return response()->json([
                "status" => "error",
                "message" => "Student not found"
            ]);
        }

        // التحقق من الباسورد
        if ($student->password != $request->password) {
            return response()->json([
                "status" => "error",
                "message" => "Wrong Password"
            ]);
        }

        return response()->json([
            "status" => "success",
            "student" => $student
        ]);
    }

    // تسجيل طالب جديد + إرسال إيميل
    public function register(Request $request)
    {
        // Validate
        $request->validate([
            'student_id' => 'required|unique:students,student_id', // ✅ عدلنا هنا
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:students,email', // ✅
            'password' => 'required|string|min:6',
        ]);

        // إنشاء الطالب
        DB::table('students')->insert([ // ✅
            'student_id' => $request->student_id,
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // نجيب الطالب
        $student = DB::table('students')
            ->where('student_id', $request->student_id)
            ->first();

        // إرسال الإيميل
        if ($student) {
            Notification::route('mail', $student->email)
                ->notify(new WelcomeNotification());
        }

        return response()->json([
            "status" => "success",
            "message" => "Student registered successfully",
            "student" => $student
        ]);
    }
}