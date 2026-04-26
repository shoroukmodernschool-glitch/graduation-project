<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Carbon\Carbon;

class AttendanceExcelController extends Controller
{
    public function check(Request $request)
    {
        $studentId = trim((string) $request->student_id);
        $today = Carbon::now()->format('Y-m-d');

        $filePath = base_path('../ai_model/attendance_log.xlsx');

        if (!file_exists($filePath)) {
            return response()->json([
                'reply' => 'لا، حضورك مش متسجل للأسف.'
            ]);
        }

        $spreadsheet = IOFactory::load($filePath);
        $sheet = $spreadsheet->getSheetByName('Attendance');

        // ⚠️ احتياطي لو الشيت مش موجود
        if (!$sheet) {
            return response()->json([
                'reply' => 'في مشكلة في ملف الحضور.'
            ]);
        }

        $rows = $sheet->toArray();

        foreach ($rows as $index => $row) {
            if ($index === 0) continue;

            $excelId = trim((string) ($row[0] ?? ''));
            $excelDate = trim((string) ($row[2] ?? ''));

            if ($excelId === $studentId && $excelDate === $today) {
                return response()->json([
                    'reply' => 'تمام، حضورك اتسجل النهارده ✅'
                ]);
            }
        }

        return response()->json([
            'reply' => 'لا، حضورك مش متسجل للأسف.'
        ]);
    }
}