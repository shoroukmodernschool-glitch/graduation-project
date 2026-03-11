<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    public function login(Request $request)
    {

        // التحقق من القيم المرسلة
        if (!$request->student_id || !$request->password) {
            return response()->json([
                "status" => "error",
                "message" => "ID and Password required"
            ]);
        }

        // البحث عن الطالب
        $student = DB::table('student')
            ->where('student_id', $request->student_id)
            ->first();

        // إذا لم يوجد الطالب
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

        // نجاح تسجيل الدخول
        return response()->json([
            "status" => "success",
            "student" => $student
        ]);
    }
}