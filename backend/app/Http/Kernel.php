<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    protected $middleware = [
        \Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests::class,
        \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
        \Illuminate\Session\Middleware\StartSession::class,
        \Illuminate\View\Middleware\ShareErrorsFromSession::class,
    ];

    protected $middlewareGroups = [
        'web' => [
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],

        'api' => [
            \Illuminate\Routing\Middleware\ThrottleRequests::class . ':api',
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],
    ];

    protected $routeMiddleware = [
        'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,
        'noBackHistory' => \App\Http\Middleware\NoBackHistory::class,

        // ✅ إضافة اللوجينج هنا
        'activity.log' => \App\Http\Middleware\ActivityLogMiddleware::class,
    ];
}