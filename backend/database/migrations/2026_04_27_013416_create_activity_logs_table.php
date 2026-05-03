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
            ActivityLog::create([
                'user_email' => $request->input('email') ?? $request->attributes->get('firebase_uid'),
                'action' => 'API_REQUEST',
                'method' => $request->method(),
                'url' => $request->path(),
                'ip' => $request->ip(),
                'data' => json_encode([
                    'status' => $response->getStatusCode(),
                    'user_agent' => $request->userAgent(),
                ]),
            ]);
        } catch (Throwable $e) {
            // متوقفش السيستم لو اللوج فشل
        }

        return $response;
    }
}