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
    Schema::create('notifications', function (Blueprint $table) {
        $table->id();
        $table->foreignId('destinataire_id')->constrained('personnes')->onDelete('cascade'); // Nouveau champ
        $table->string('type_notification');
        $table->text('message');
        $table->timestamp('date_envoi')->useCurrent();
        $table->timestamps();
    });
    
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
