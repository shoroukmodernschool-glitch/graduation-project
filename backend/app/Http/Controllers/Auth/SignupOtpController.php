<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class SignupOtpController extends Controller
{
    private function normalizeEmail(string $email): string
    {
        return strtolower(trim($email));
    }

    private function generateOtp(): string
    {
        return (string) rand(100000, 999999);
    }

    private function sendOtpEmail(string $email, string $otp): void
    {
        Mail::raw("Your OTP Code is: $otp", function ($message) use ($email) {
            $message->to($email)->subject('Your Verification Code');
        });
    }

    public function sendOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Valid email is required',
                'errors' => $validator->errors()
            ], 422);
        }

        $email = $this->normalizeEmail($request->email);

        $existing = DB::table('pending_signups')->where('email', $email)->first();

        if ($existing && $existing->last_sent_at) {
            $lastSentAt = Carbon::parse($existing->last_sent_at);

            if ($lastSentAt->diffInSeconds(now()) < 60) {
                return response()->json([
                    'success' => false,
                    'message' => 'Please wait before requesting another code'
                ], 429);
            }
        }

        $otp = $this->generateOtp();

        DB::table('pending_signups')->updateOrInsert(
            ['email' => $email],
            [
                'otp_code' => $otp,
                'otp_expires_at' => Carbon::now()->addMinutes(10),
                'is_verified' => false,
                'verify_attempts' => 0,
                'last_sent_at' => now(),
                'verified_at' => null,
                'updated_at' => now(),
                'created_at' => $existing?->created_at ?? now(),
            ]
        );

        $this->sendOtpEmail($email, $otp);

        return response()->json([
            'success' => true,
            'message' => 'OTP sent successfully'
        ]);
    }

    public function resendOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Valid email is required',
                'errors' => $validator->errors()
            ], 422);
        }

        $email = $this->normalizeEmail($request->email);

        $record = DB::table('pending_signups')->where('email', $email)->first();

        if (!$record) {
            return response()->json([
                'success' => false,
                'message' => 'No OTP request found for this email'
            ], 404);
        }

        if ($record->last_sent_at) {
            $lastSentAt = Carbon::parse($record->last_sent_at);

            if ($lastSentAt->diffInSeconds(now()) < 60) {
                return response()->json([
                    'success' => false,
                    'message' => 'Please wait before requesting another code'
                ], 429);
            }
        }

        $otp = $this->generateOtp();

        DB::table('pending_signups')
            ->where('email', $email)
            ->update([
                'otp_code' => $otp,
                'otp_expires_at' => Carbon::now()->addMinutes(10),
                'is_verified' => false,
                'verify_attempts' => 0,
                'last_sent_at' => now(),
                'verified_at' => null,
                'updated_at' => now(),
            ]);

        $this->sendOtpEmail($email, $otp);

        return response()->json([
            'success' => true,
            'message' => 'OTP resent successfully'
        ]);
    }

    public function verifyOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'code' => 'required|digits:6'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Email and 6-digit code are required',
                'errors' => $validator->errors()
            ], 422);
        }

        $email = $this->normalizeEmail($request->email);
        $code = trim($request->code);

        $record = DB::table('pending_signups')->where('email', $email)->first();

        if (!$record) {
            return response()->json([
                'success' => false,
                'message' => 'No OTP found for this email'
            ], 404);
        }

        if ($record->is_verified) {
            return response()->json([
                'success' => true,
                'message' => 'Email already verified'
            ]);
        }

        if ($record->verify_attempts >= 5) {
            return response()->json([
                'success' => false,
                'message' => 'Too many wrong attempts. Please request a new code'
            ], 429);
        }

        if (Carbon::now()->gt(Carbon::parse($record->otp_expires_at))) {
            return response()->json([
                'success' => false,
                'message' => 'Code expired'
            ], 400);
        }

        if ($record->otp_code !== $code) {
            DB::table('pending_signups')
                ->where('email', $email)
                ->update([
                    'verify_attempts' => $record->verify_attempts + 1,
                    'updated_at' => now()
                ]);

            return response()->json([
                'success' => false,
                'message' => 'Wrong code'
            ], 400);
        }

        DB::table('pending_signups')
            ->where('email', $email)
            ->update([
                'is_verified' => true,
                'verified_at' => now(),
                'verify_attempts' => 0,
                'updated_at' => now()
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Email verified successfully'
        ]);
    }
}