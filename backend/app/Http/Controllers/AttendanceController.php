<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use Kreait\Firebase\Factory;

class AttendanceController extends Controller
{
    protected $firestore;

    public function __construct()
    {
        $credentialsPath = base_path('../ai_model/firebase_key.json');

        putenv('GOOGLE_APPLICATION_CREDENTIALS=' . $credentialsPath);

        $factory = (new Factory)
            ->withServiceAccount($credentialsPath)
            ->withProjectId('shorouk-modern-school');

        $this->firestore = $factory->createFirestore()->database();
    }

    public function markAttendance(Request $request)
    {
        $request->validate([
            'student_id' => 'required'
        ]);

        $studentId = trim($request->student_id);
        $today = Carbon::now()->format('Y-m-d');

        // ✅ جلب الطالب عن طريق field اسمه student_id
        $students = $this->firestore
            ->collection('student')
            ->where('student_id', '=', $studentId)
            ->limit(1)
            ->documents();

        $student = null;
        $studentDocId = null;

        foreach ($students as $doc) {
            if ($doc->exists()) {
                $student = $doc->data();
                $studentDocId = $doc->id();
                break;
            }
        }

        if (!$student) {
            return response()->json([
                'message' => 'Student not found',
                'received_student_id' => $studentId
            ], 404);
        }

        $docId = $studentId . '_' . $today;

        // ✅ منع تسجيل نفس الطالب مرتين في نفس اليوم
        $attendanceRef = $this->firestore
            ->collection('attendance')
            ->document($docId);

        if ($attendanceRef->snapshot()->exists()) {
            return response()->json([
                'message' => 'Already recorded',
                'student_id' => $studentId
            ], 409);
        }

        // ✅ تسجيل الحضور
        $attendanceRef->set([
            'student_id' => $studentId,
            'student_doc_id' => $studentDocId,
            'date' => $today,
            'status' => 'present',
            'created_at' => now()->toDateTimeString(),
        ]);

        // ✅ إنشاء notification للـ parent
        $this->firestore->collection('notifications')->add([
            'student_id' => $studentId,
            'student_doc_id' => $studentDocId,
            'student_name' => ($student['firstName'] ?? '') . ' ' . ($student['lastName'] ?? ''),
            'parent_id' => $student['parent_id'] ?? null,
            'parent_email' => $student['parent_email'] ?? null,
            'title' => 'Attendance Recorded',
            'message' => 'Your child is present today',
            'type' => 'attendance',
            'is_read' => false,
            'created_at' => now()->toDateTimeString(),
        ]);

        return response()->json([
            'message' => 'Attendance + Notification done',
            'student_id' => $studentId,
            'student_doc_id' => $studentDocId
        ]);
    }
}