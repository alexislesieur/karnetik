<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicle_models', function (Blueprint $table) {
            $table->id();

            $table
                ->foreignId('vehicle_brand_id')
                ->constrained('vehicle_brands')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->string('nom');
            $table->string('slug');
            $table->boolean('actif')->default(true);
            $table->timestamps();

            $table->unique([
                'vehicle_brand_id',
                'slug',
            ]);

            $table->index('actif');
            $table->index([
                'vehicle_brand_id',
                'actif',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicle_models');
    }
};
