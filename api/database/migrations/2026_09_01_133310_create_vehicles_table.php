<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();

            $table
                ->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table
                ->foreignId('vehicle_brand_id')
                ->constrained('vehicle_brands')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table
                ->foreignId('vehicle_model_id')
                ->constrained('vehicle_models')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->string('immatriculation', 9);
            $table->unsignedInteger('kilometrage_actuel');
            $table->date('mise_en_circulation');

            $table->timestamps();

            $table->unique('immatriculation');

            $table->index('user_id');
            $table->index([
                'vehicle_brand_id',
                'vehicle_model_id',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
