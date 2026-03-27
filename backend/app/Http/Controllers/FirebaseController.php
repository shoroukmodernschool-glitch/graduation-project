<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Kreait\Firebase\Factory;
use Kreait\Firebase\Exception\Auth\FailedToVerifyToken;

class FirebaseController extends Controller
{
    public function verifyToken(Request $request)
    {
        $idToken = $request->input('token');

        if (!$idToken) {
            return response()->json([
                'status' => 'error',
                'message' => 'Token is required'
            ], 400);
        }

        try {
            $auth = (new Factory)
                ->withServiceAccount(config('firebase.credentials'))
                ->createAuth();

            $verifiedIdToken = $auth->verifyIdToken($idToken);

            $uid = $verifiedIdToken->claims()->get('sub');

            return response()->json([
                'status' => 'success',
                'uid' => $uid
            ]);

        } catch (FailedToVerifyToken $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid token'
            ], 401);
        }
    }
}