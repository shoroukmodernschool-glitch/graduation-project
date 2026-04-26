<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\LoginSecurityService;
use Illuminate\Http\Request;

class LoginSecurityController extends Controller
{
    public function __construct(private LoginSecurityService $securityService)
    {
    }

    public function checkLock(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $result = $this->securityService->checkLock($request->email);

        if ($result['locked']) {
            return response()->json([
                'message' => 'Account is temporarily locked.',
                'data' => $result,
            ], 423);
        }

        return response()->json([
            'message' => 'Account is not locked.',
            'data' => $result,
        ]);
    }

    public function recordFailed(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $result = $this->securityService->recordFailedAttempt(
            $request->email,
            $request->ip()
        );

        if ($result['locked']) {
            return response()->json([
                'message' => 'Too many failed attempts. Account locked for 10 minutes.',
                'data' => $result,
            ], 423);
        }

        return response()->json([
            'message' => 'Failed login attempt recorded.',
            'data' => $result,
        ]);
    }

    public function clearAttempts(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $this->securityService->clearAttempts($request->email);

        return response()->json([
            'message' => 'Login attempts cleared successfully.',
        ]);
    }
}