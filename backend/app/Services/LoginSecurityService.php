<?php

namespace App\Services;

use App\Models\LoginAttempt;

class LoginSecurityService
{
    private const MAX_FAILED_ATTEMPTS = 5;
    private const LOCK_MINUTES = 10;

    public function checkLock(string $email): array
    {
        $attempt = LoginAttempt::where('email', $email)->first();

        if (!$attempt) {
            return [
                'locked' => false,
                'failed_attempts' => 0,
                'remaining_attempts' => self::MAX_FAILED_ATTEMPTS,
            ];
        }

        if ($attempt->locked_until && $attempt->locked_until->isFuture()) {
            return [
                'locked' => true,
                'failed_attempts' => $attempt->failed_attempts,
                'remaining_attempts' => 0,
                'locked_until' => $attempt->locked_until->toDateTimeString(),
                'remaining_seconds' => now()->diffInSeconds($attempt->locked_until),
            ];
        }

        if ($attempt->locked_until && $attempt->locked_until->isPast()) {
            $attempt->update([
                'failed_attempts' => 0,
                'last_failed_at' => null,
                'locked_until' => null,
            ]);

            return [
                'locked' => false,
                'failed_attempts' => 0,
                'remaining_attempts' => self::MAX_FAILED_ATTEMPTS,
            ];
        }

        return [
            'locked' => false,
            'failed_attempts' => $attempt->failed_attempts,
            'remaining_attempts' => max(0, self::MAX_FAILED_ATTEMPTS - $attempt->failed_attempts),
        ];
    }

    public function recordFailedAttempt(string $email, ?string $ip = null): array
    {
        $attempt = LoginAttempt::firstOrCreate(
            ['email' => $email],
            [
                'failed_attempts' => 0,
                'last_failed_at' => null,
                'locked_until' => null,
                'last_ip' => null,
            ]
        );

        if ($attempt->locked_until && $attempt->locked_until->isFuture()) {
            return [
                'locked' => true,
                'failed_attempts' => $attempt->failed_attempts,
                'remaining_attempts' => 0,
                'locked_until' => $attempt->locked_until->toDateTimeString(),
                'remaining_seconds' => now()->diffInSeconds($attempt->locked_until),
            ];
        }

        if ($attempt->locked_until && $attempt->locked_until->isPast()) {
            $attempt->failed_attempts = 0;
            $attempt->locked_until = null;
        }

        $attempt->failed_attempts += 1;
        $attempt->last_failed_at = now();
        $attempt->last_ip = $ip;

        $locked = false;

        if ($attempt->failed_attempts >= self::MAX_FAILED_ATTEMPTS) {
            $attempt->locked_until = now()->addMinutes(self::LOCK_MINUTES);
            $locked = true;
        }

        $attempt->save();

        return [
            'locked' => $locked,
            'failed_attempts' => $attempt->failed_attempts,
            'remaining_attempts' => $locked ? 0 : max(0, self::MAX_FAILED_ATTEMPTS - $attempt->failed_attempts),
            'locked_until' => $attempt->locked_until?->toDateTimeString(),
            'remaining_seconds' => $attempt->locked_until && $attempt->locked_until->isFuture()
                ? now()->diffInSeconds($attempt->locked_until)
                : null,
        ];
    }

    public function clearAttempts(string $email): void
    {
        LoginAttempt::where('email', $email)->update([
            'failed_attempts' => 0,
            'last_failed_at' => null,
            'locked_until' => null,
            'last_ip' => null,
        ]);
    }
}