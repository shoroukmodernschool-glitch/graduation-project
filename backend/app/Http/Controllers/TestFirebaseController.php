<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\FirebaseService;

class TestFirebaseController extends Controller
{
    protected $firebase;

    public function __construct(FirebaseService $firebase)
    {
        $this->firebase = $firebase;
    }

    public function test()
    {
        return response()->json([
            'message' => 'Firebase connected successfully'
        ]);
    }

    // 👇 دي الجديدة
    public function verifyToken(Request $request)
    {
        try {
            $idToken = $request->token;

            $verifiedIdToken = $this->firebase->verifyIdToken($idToken);

            $uid = $verifiedIdToken->claims()->get('sub');

            return response()->json([
                'status' => 'success',
                'uid' => $uid
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid token'
            ], 401);
        }
    }
}