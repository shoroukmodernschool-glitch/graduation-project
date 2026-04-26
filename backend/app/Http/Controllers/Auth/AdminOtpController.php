<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;
use App\Helpers\ActivityLogger;

class AdminOtpController extends Controller
{
    // ✅ إرسال OTP
    public function sendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $otp = rand(100000, 999999);

        // نحذف أي OTP قديم لنفس الإيميل
        DB::table('admin_login_otps')
            ->where('email', $request->email)
            ->delete();

        DB::table('admin_login_otps')->insert([
            'email' => $request->email,
            'otp_code' => $otp,
            'expires_at' => Carbon::now()->addMinutes(5),
            'attempts' => 0,
            'is_used' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // إرسال الإيميل
        Mail::raw("Your Admin OTP is: $otp", function ($message) use ($request) {
            $message->to($request->email)
                    ->subject('Admin Login OTP');
        });

        ActivityLogger::log(
            $request,
            'ADMIN_OTP_SENT',
            'Admin OTP sent to email',
            $request->email,
            'admin'
        );

        return response()->json([
            'message' => 'OTP sent successfully'
        ]);
    }

    // ✅ التحقق من OTP
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required'
        ]);

        $record = DB::table('admin_login_otps')
            ->where('email', $request->email)
            ->latest()
            ->first();

        if (!$record) {
            ActivityLogger::log(
                $request,
                'ADMIN_OTP_FAILED',
                'No OTP found',
                $request->email,
                'admin'
            );

            return response()->json(['message' => 'No OTP found'], 400);
        }

        // زيادة عدد المحاولات
        DB::table('admin_login_otps')
            ->where('id', $record->id)
            ->increment('attempts');

        if ($record->attempts >= 5) {
            ActivityLogger::log(
                $request,
                'ADMIN_OTP_FAILED',
                'Too many OTP attempts',
                $request->email,
                'admin'
            );

            return response()->json(['message' => 'Too many attempts'], 403);
        }

        if ($record->is_used) {
            ActivityLogger::log(
                $request,
                'ADMIN_OTP_FAILED',
                'OTP already used',
                $request->email,
                'admin'
            );

            return response()->json(['message' => 'OTP already used'], 400);
        }

        if (Carbon::now()->gt($record->expires_at)) {
            ActivityLogger::log(
                $request,
                'ADMIN_OTP_FAILED',
                'OTP expired',
                $request->email,
                'admin'
            );

            return response()->json(['message' => 'OTP expired'], 400);
        }

        if ($record->otp_code != $request->otp) {
            ActivityLogger::log(
                $request,
                'ADMIN_OTP_FAILED',
                'Invalid OTP',
                $request->email,
                'admin'
            );

            return response()->json(['message' => 'Invalid OTP'], 400);
        }

        // نجاح → نعلّم عليه إنه اتستخدم
        DB::table('admin_login_otps')
            ->where('id', $record->id)
            ->update(['is_used' => true]);

        ActivityLogger::log(
            $request,
            'ADMIN_OTP_SUCCESS',
            'Admin OTP verified successfully',
            $request->email,
            'admin'
        );

        return response()->json([
            'message' => 'OTP verified successfully'
        ]);
    }
}