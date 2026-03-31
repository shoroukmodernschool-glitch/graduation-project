<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Kreait\Firebase\Exception\FirebaseException;
use Kreait\Firebase\Factory;
use Symfony\Component\HttpFoundation\Response;

class FirebaseAuth
{
    public function handle(Request $request, Closure $next): Response
    {
        $idToken = $request->bearerToken();

        if (!$idToken) {
            return response()->json(['error' => 'No token'], 401);
        }

        try {
            $configured = env('FIREBASE_CREDENTIALS');
            if ($configured === null || trim((string) $configured) === '') {
                $credentialsPath = storage_path('firebase/firebase.json');
            } else {
                $configured = trim($configured, " \t\n\r\0\x0B\"'");
                $isAbsolute = str_starts_with($configured, '/')
                    || str_starts_with($configured, '\\')
                    || (strlen($configured) > 2 && ctype_alpha($configured[0]) && $configured[1] === ':');
                $credentialsPath = $isAbsolute ? $configured : base_path($configured);
            }

            if (! is_file($credentialsPath)) {
                return response()->json(['error' => 'Firebase credentials not configured'], 500);
            }

            $auth = (new Factory())
                ->withServiceAccount($credentialsPath)
                ->createAuth();

            $verifiedIdToken = $auth->verifyIdToken($idToken);
            $uid = $verifiedIdToken->claims()->get('sub');

            $request->attributes->set('firebase_uid', $uid);

        } catch (FirebaseException|\InvalidArgumentException $e) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $next($request);
    }
}