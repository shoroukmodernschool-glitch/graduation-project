<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoginAttempt extends Model
{
    protected $fillable = [
        'email',
        'failed_attempts',
        'last_failed_at',
        'locked_until',
        'last_ip',
    ];

    protected $casts = [
        'last_failed_at' => 'datetime',
        'locked_until' => 'datetime',
    ];
}