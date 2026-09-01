<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

#[Fillable([
    'vehicle_brand_id',
    'nom',
    'slug',
    'actif',
])]
class VehicleModel extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'actif' => 'boolean',
        ];
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(
            VehicleBrand::class,
            'vehicle_brand_id',
        );
    }

    protected static function booted(): void
    {
        static::creating(function (VehicleModel $model): void {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->nom);
            }
        });
    }
}
