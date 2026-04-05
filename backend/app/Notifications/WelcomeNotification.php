<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class WelcomeNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail']; // يبعت إيميل
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Welcome to Our Site!') // عنوان الإيميل
            ->greeting('Hello ' . $notifiable->name . '!') // اسم المستخدم
            ->line('Thanks for registering on our site.') // الرسالة الرئيسية
            ->action('Go to Dashboard', url('/')) // رابط يضغط عليه المستخدم
            ->line('We are happy to have you with us!'); // رسالة ختامية
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}