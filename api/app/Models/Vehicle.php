<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'user_id',
    'vehicle_brand_id',
    'vehicle_model_id',
    'immatriculation',
    'kilometrage_actuel',
    'mise_en_circulation',
])]
class Vehicle extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'kilometrage_actuel' => 'integer',
            'mise_en_circulation' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(
            VehicleBrand::class,
            'vehicle_brand_id',
        );
    }

    public function model(): BelongsTo
    {
        return $this->belongsTo(
            VehicleModel::class,
            'vehicle_model_id',
        );
    }
}
