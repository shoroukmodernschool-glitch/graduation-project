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

    private int $sendCooldownSeconds = 60;
    private int $maxSendAttempts = 5;
    private int $sendBlockMinutes = 15;

    private int $maxVerifyAttempts = 5;
    private int $verifyBlockMinutes = 15;

    public function __construct()
    {
        $configured = env('FIREBASE_CREDENTIALS', 'storage/firebase.json');
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
            $emailHash = md5($email);

            $sendCooldownKey = 'password_reset_send_cooldown_' . $emailHash;
            $sendAttemptsKey = 'password_reset_send_attempts_' . $emailHash;
            $sendBlockedKey = 'password_reset_send_blocked_' . $emailHash;

            if (Cache::has($sendBlockedKey)) {
                return response()->json([
                    'message' => 'Too many requests. Please try again later.'
                ], 429);
            }

            if (Cache::has($sendCooldownKey)) {
                return response()->json([
                    'message' => 'Please wait 60 seconds before requesting another code.'
                ], 429);
            }

            $sendAttempts = Cache::get($sendAttemptsKey, 0);

            if ($sendAttempts >= $this->maxSendAttempts) {
                Cache::put($sendBlockedKey, true, now()->addMinutes($this->sendBlockMinutes));
                Cache::forget($sendAttemptsKey);

                return response()->json([
                    'message' => 'Too many code requests. You are temporarily blocked for 15 minutes.'
                ], 429);
            }

            try {
                $this->auth->getUserByEmail($email);
            } catch (Throwable $e) {
                return response()->json([
                    'message' => 'Email not found'
                ], 404);
            }

            $code = (string) random_int(100000, 999999);

            Cache::put(
                'password_reset_code_' . $emailHash,
                [
                    'email' => $email,
                    'code' => $code,
                    'used' => false,
                ],
                now()->addMinutes(10)
            );

            Cache::put($sendCooldownKey, true, now()->addSeconds($this->sendCooldownSeconds));
            Cache::put($sendAttemptsKey, $sendAttempts + 1, now()->addMinutes($this->sendBlockMinutes));

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
            $emailHash = md5($email);

            $cacheKey = 'password_reset_code_' . $emailHash;
            $verifyAttemptsKey = 'password_reset_verify_attempts_' . $emailHash;
            $verifyBlockedKey = 'password_reset_verify_blocked_' . $emailHash;

            if (Cache::has($verifyBlockedKey)) {
                return response()->json([
                    'message' => 'Too many wrong attempts. Please try again later.'
                ], 429);
            }

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
                $verifyAttempts = Cache::get($verifyAttemptsKey, 0) + 1;

                if ($verifyAttempts >= $this->maxVerifyAttempts) {
                    Cache::put($verifyBlockedKey, true, now()->addMinutes($this->verifyBlockMinutes));
                    Cache::forget($verifyAttemptsKey);

                    return response()->json([
                        'message' => 'Too many wrong attempts. You are temporarily blocked for 15 minutes.'
                    ], 429);
                }

                Cache::put($verifyAttemptsKey, $verifyAttempts, now()->addMinutes($this->verifyBlockMinutes));

                return response()->json([
                    'message' => 'Invalid verification code'
                ], 400);
            }

            $data['used'] = true;
            Cache::put($cacheKey, $data, now()->addMinutes(10));
            Cache::forget($verifyAttemptsKey);
            Cache::forget($verifyBlockedKey);

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