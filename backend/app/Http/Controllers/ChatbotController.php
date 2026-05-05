<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChatbotController extends Controller
{
    public function ask(Request $request)
    {
        $request->validate([
            'student_id' => 'required|string',
            'message' => 'required|string',
        ]);

        try {
            $response = Http::timeout(10)->post('http://127.0.0.1:5001/ask', [
                'student_id' => $request->student_id,
                'message' => $request->message,
            ]);

            if (!$response->successful()) {
                return response()->json([
                    'reply' => 'في مشكلة في سيرفر الـ AI.'
                ], 500);
            }

            return response()->json([
                'reply' => $response->json('reply')
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'reply' => 'الـ AI مش شغال دلوقتي. شغل Flask الأول.'
            ], 500);
        }
    }
}