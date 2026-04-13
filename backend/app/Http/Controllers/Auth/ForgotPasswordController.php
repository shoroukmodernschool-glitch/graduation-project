<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\ForgotPasswordCodeMail;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Kreait\Firebase\Factory;
use Throwable;

class ForgotPasswordController extends Controller
{
    protected $auth;
    protected $firestore;

    public function __construct()
    {
        $credentialsPath = storage_path('firebase/firebase.json');

        $factory = (new Factory)->withServiceAccount($credentialsPath);

        $this->auth = $factory->createAuth();
        $this->firestore = $factory->createFirestore()->database();
    }

    public function sendCode(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        try {
            $email = strtolower(trim($request->email));

            $existsInAuth = false;
            $existsInStudent = false;

            try {
                $this->auth->getUserByEmail($email);
                $existsInAuth = true;
            } catch (Throwable $e) {
                $existsInAuth = false;
            }

            $studentQuery = $this->firestore
                ->collection('student')
                ->where('email', '=', $email)
                ->documents();

            foreach ($studentQuery as $doc) {
                if ($doc->exists()) {
                    $existsInStudent = true;
                    break;
                }
            }

            if (!$existsInAuth && !$existsInStudent) {
                return response()->json([
                    'message' => 'Email not found'
                ], 404);
            }

            $code = (string) random_int(100000, 999999);

            $now = Carbon::now();
            $expiresAt = $now->copy()->addMinutes(10);

            $docId = md5($email);

            $this->firestore
                ->collection('password_reset_codes')
                ->document($docId)
                ->set([
                    'email' => $email,
                    'code' => $code,
                    'expires_at' => $expiresAt->toDateTimeString(),
                    'used' => false,
                    'created_at' => $now->toDateTimeString(),
                ]);

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
}