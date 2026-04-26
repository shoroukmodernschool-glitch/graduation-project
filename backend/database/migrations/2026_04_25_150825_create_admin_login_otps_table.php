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
        Schema::create('admin_login_otps', function (Blueprint $table) {
            $table->id();

            $table->string('email'); // ايميل الادمن
            $table->string('otp_code'); // الكود

            $table->timestamp('expires_at'); // وقت الانتهاء

            $table->integer('attempts')->default(0); // عدد المحاولات
            $table->boolean('is_used')->default(false); // هل استخدم ولا لا

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin_login_otps');
    }
};