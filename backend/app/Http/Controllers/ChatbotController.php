<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ChatbotController extends Controller
{
    public function sendMessage(Request $request)
    {
        $message = strtolower($request->input('message'));

        $responses = [
            'غياب' => 'تم تسجيل غيابك اليوم 👍',
            'درجات' => 'درجاتك ممتازة كمل كده 💯',
            'جدول' => 'عندك رياضة وبعدها علوم النهارده 📚',
            'امتحان' => 'الامتحان يوم الأحد الجاي 📝',
            'واجب' => 'عندك واجب رياضيات لازم يتسلم بكرة ✏️'
        ];

        foreach ($responses as $key => $reply) {
            if (str_contains($message, $key)) {
                return response()->json([
                    'reply' => $reply
                ]);
            }
        }

        return response()->json([
            'reply' => 'ممكن تسأل عن الغياب أو الدرجات أو الجدول 😊'
        ]);
    }
}