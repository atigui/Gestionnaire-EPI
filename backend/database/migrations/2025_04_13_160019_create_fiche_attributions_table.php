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
    Schema::create('fiche_attributions', function (Blueprint $table) {
        $table->id();
        $table->date('date_generation');
        $table->string('format')->default('PDF');
        $table->string('chemin_fichier');
        $table->foreignId('attribution_id')->constrained()->onDelete('cascade');
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fiche_attributions');
    }
};
