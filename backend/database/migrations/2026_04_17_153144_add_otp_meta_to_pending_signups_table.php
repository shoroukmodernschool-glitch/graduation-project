<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pending_signups', function (Blueprint $table) {
            $table->unsignedInteger('verify_attempts')->default(0)->after('is_verified');
            $table->timestamp('last_sent_at')->nullable()->after('verify_attempts');
            $table->timestamp('verified_at')->nullable()->after('last_sent_at');
        });
    }

    public function down(): void
    {
        Schema::table('pending_signups', function (Blueprint $table) {
            $table->dropColumn(['verify_attempts', 'last_sent_at', 'verified_at']);
        });
    }
};