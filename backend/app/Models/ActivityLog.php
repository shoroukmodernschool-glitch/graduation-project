<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    protected $fillable = [
        'user_email',
        'action',
        'method',
        'url',
        'ip',
        'data',
    ];

    protected $casts = [
        'data' => 'array',
    ];
}