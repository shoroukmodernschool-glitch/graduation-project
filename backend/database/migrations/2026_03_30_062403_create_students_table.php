<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();                        // معرف الطالب
            $table->string('name');              // اسم الطالب
            $table->string('email')->unique();   // ايميل الطالب
            $table->string('phone')->nullable(); // رقم الهاتف (اختياري)
            $table->timestamps();                // created_at و updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};