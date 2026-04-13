<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ForgotPasswordCodeMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $code;

    public function __construct(string $code)
    {
        $this->code = $code;
    }

    public function build()
    {
        return $this->subject('Your Password Reset Code')
            ->html("
                <div style='font-family: Arial, sans-serif; padding: 20px;'>
                    <h2>Forgot Password</h2>
                    <p>Your password reset code is:</p>
                    <h1 style='letter-spacing: 4px;'>{$this->code}</h1>
                    <p>This code will expire in 10 minutes.</p>
                </div>
            ");
    }
}