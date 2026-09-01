<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

#[Fillable([
    'nom',
    'slug',
    'actif',
])]
class VehicleBrand extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'actif' => 'boolean',
        ];
    }

    public function models(): HasMany
    {
        return $this->hasMany(VehicleModel::class);
    }

    protected static function booted(): void
    {
        static::creating(function (VehicleBrand $brand): void {
            if (empty($brand->slug)) {
                $brand->slug = Str::slug($brand->nom);
            }
        });
    }
}
