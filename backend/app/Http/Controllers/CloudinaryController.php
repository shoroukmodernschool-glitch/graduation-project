<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Cloudinary\Cloudinary;

class CloudinaryController extends Controller
{
    private function cloudinary()
    {
        return new Cloudinary([
            'cloud' => [
                'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                'api_key' => env('CLOUDINARY_API_KEY'),
                'api_secret' => env('CLOUDINARY_API_SECRET'),
            ],
            'url' => [
                'secure' => true,
            ],
        ]);
    }

    public function uploadStudentPhoto(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
            'student_id' => 'required|string|max:100',
        ]);

        $safeStudentId = preg_replace('/[^A-Za-z0-9_-]/', '_', $request->student_id);

        $cloudinary = $this->cloudinary();

        $uploaded = $cloudinary->uploadApi()->upload(
            $request->file('image')->getRealPath(),
            [
                'folder' => 'smart-school/students',
                'public_id' => 'student_' . $safeStudentId . '_' . time(),
                'resource_type' => 'image',
                'type' => 'authenticated',
                'overwrite' => false,
                'allowed_formats' => ['jpg', 'jpeg', 'png', 'webp'],
            ]
        );

        return response()->json([
            'message' => 'Image uploaded securely.',
            'public_id' => $uploaded['public_id'] ?? null,
            'format' => $uploaded['format'] ?? null,
            'resource_type' => $uploaded['resource_type'] ?? 'image',
            'type' => $uploaded['type'] ?? 'authenticated',
        ]);
    }

    public function getStudentPhotoUrl(Request $request)
    {
        $request->validate([
            'public_id' => 'required|string',
            'format' => 'required|string',
        ]);

        $cloudName = env('CLOUDINARY_CLOUD_NAME');
        $apiSecret = env('CLOUDINARY_API_SECRET');

        $publicId = $request->public_id;
        $format = $request->format;

        $pathToSign = $publicId . '.' . $format;

        $signature = substr(
            strtr(base64_encode(sha1($pathToSign . $apiSecret, true)), '+/', '-_'),
            0,
            8
        );

        $url = "https://res.cloudinary.com/{$cloudName}/image/authenticated/s--{$signature}--/{$publicId}.{$format}";

        return response()->json([
            'url' => $url,
        ]);
    }
}