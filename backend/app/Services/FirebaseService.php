<?php

namespace App\Services;

use Kreait\Firebase\Factory;

class FirebaseService
{
    protected $auth;

    public function __construct()
    {
        $factory = (new Factory)
            ->withServiceAccount(storage_path('firebase/firebase_credentials.json'));

        $this->auth = $factory->createAuth();
    }

    public function auth()
    {
        return $this->auth;
    }

    // 👇 دي الجديدة
    public function verifyIdToken($token)
    {
        return $this->auth->verifyIdToken($token);
    }
}