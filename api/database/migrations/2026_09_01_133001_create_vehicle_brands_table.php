<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicle_brands', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('slug')->unique();
            $table->boolean('actif')->default(true);
            $table->timestamps();

            $table->index('actif');
            $table->index('nom');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicle_brands');
    }
};
