<?php

namespace App\Helpers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogger
{
    public static function log(Request $request, string $action, ?string $description = null, ?string $email = null, ?string $role = null): void
    {
        ActivityLog::create([
            'user_email' => $email,
            'user_role' => $role,
            'action' => $action,
            'description' => $description,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);
    }
}