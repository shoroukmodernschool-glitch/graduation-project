<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\ForgotPasswordCodeMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Kreait\Firebase\Factory;
use Throwable;

class ForgotPasswordController extends Controller
{
    protected $auth;

    public function __construct()
    {
        $configured = env('FIREBASE_CREDENTIALS', 'storage/firebase/firebase.json');
        $credentialsPath = base_path($configured);

        if (!file_exists($credentialsPath)) {
            throw new \Exception('Firebase credentials file not found: ' . $credentialsPath);
        }

        $factory = (new Factory)->withServiceAccount($credentialsPath);
        $this->auth = $factory->createAuth();
    }

    public function sendCode(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        try {
            $email = strtolower(trim($request->email));

            try {
                $this->auth->getUserByEmail($email);
            } catch (Throwable $e) {
                return response()->json([
                    'message' => 'Email not found'
                ], 404);
            }

            $code = (string) random_int(100000, 999999);

            Cache::put(
                'password_reset_code_' . md5($email),
                [
                    'email' => $email,
                    'code' => $code,
                    'used' => false,
                ],
                now()->addMinutes(10)
            );

            Mail::to($email)->send(new ForgotPasswordCodeMail($code));

            return response()->json([
                'message' => 'Verification code sent successfully'
            ], 200);

        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Failed to send verification code',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function verifyCode(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'code' => ['required'],
        ]);

        try {
            $email = strtolower(trim($request->email));
            $code = trim($request->code);

            $cacheKey = 'password_reset_code_' . md5($email);
            $data = Cache::get($cacheKey);

            if (!$data) {
                return response()->json([
                    'message' => 'Verification code not found or expired'
                ], 404);
            }

            if (!empty($data['used'])) {
                return response()->json([
                    'message' => 'This code has already been used'
                ], 400);
            }

            if (($data['code'] ?? '') !== $code) {
                return response()->json([
                    'message' => 'Invalid verification code'
                ], 400);
            }

            $data['used'] = true;
            Cache::put($cacheKey, $data, now()->addMinutes(10));

            return response()->json([
                'message' => 'Code verified successfully'
            ], 200);

        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Failed to verify code',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'min:6', 'confirmed'],
        ]);

        try {
            $email = strtolower(trim($request->email));
            $cacheKey = 'password_reset_code_' . md5($email);
            $data = Cache::get($cacheKey);

            if (!$data) {
                return response()->json([
                    'message' => 'Verification code not found or expired'
                ], 404);
            }

            if (empty($data['used'])) {
                return response()->json([
                    'message' => 'Please verify the code first'
                ], 400);
            }

            $user = $this->auth->getUserByEmail($email);
            $this->auth->changeUserPassword($user->uid, $request->password);

            Cache::forget($cacheKey);

            return response()->json([
                'message' => 'Password reset successfully'
            ], 200);

        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Failed to reset password',
                'error_details' => $e->getMessage()
            ], 500);
        }
    }
}