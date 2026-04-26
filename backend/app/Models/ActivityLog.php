<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    protected $fillable = [
        'user_email',
        'user_role',
        'action',
        'description',
        'ip_address',
        'user_agent',
    ];
}