<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable([
    'prenom',
    'email',
    'password',
    'email_verified_at',
    'onboarding_completed',
])]

#[Hidden([
    'password',
    'remember_token',
])]

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    public function vehicles(): HasMany
    {
        return $this->hasMany(Vehicle::class);
    }

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'onboarding_completed' => 'boolean',
            'password' => 'hashed',
        ];
    }
}
