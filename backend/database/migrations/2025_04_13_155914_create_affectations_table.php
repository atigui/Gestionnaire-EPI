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
    Schema::create('affectations', function (Blueprint $table) {
        $table->id();
        $table->foreignId('employe_id')->constrained('employes')->onDelete('cascade');
        $table->foreignId('materiel_id')->constrained('materiels')->onDelete('cascade');
        $table->date('date_affectation');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('affectations');
    }
};
