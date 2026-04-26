<?php

namespace App\Http\Middleware;

use App\Models\ActivityLog;
use Closure;
use Illuminate\Http\Request;
use Throwable;

class ActivityLogMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        try {
            $email = $request->input('email');

            if (!$email && $request->attributes->has('firebase_uid')) {
                $email = $request->attributes->get('firebase_uid');
            }

            $userAgent = $request->userAgent();
            $userAgent = $userAgent ? substr($userAgent, 0, 255) : null;

            ActivityLog::create([
                'user_email' => $email ?? null,
                'user_role' => $request->input('role') ?? null,
                'action' => $request->method() . ' ' . $request->path(),
                'description' => 'User accessed ' . $request->path(),
                'ip_address' => $request->ip(),
                'user_agent' => $userAgent,
            ]);
        } catch (Throwable $e) {
            // متوقفش السيستم لو حصل error
        }

        return $response;
    }
}