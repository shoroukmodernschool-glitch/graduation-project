<?php

namespace App\Http\Middleware;

use App\Models\ActivityLog;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ActivityLogMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        ActivityLog::create([
            'user_email' => $request->input('email'),
            'user_role' => $request->input('role'),
            'action' => 'API_REQUEST',
            'description' => $request->method() . ' ' . $request->path() . ' - status ' . $response->getStatusCode(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return $response;
    }
}