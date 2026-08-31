<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::create([
            'prenom' => $validated['prenom'],
            'email' => $validated['email'],
            'password' => $validated['password'],
        ]);

        $token = $user->createToken('karnetik-mobile')->plainTextToken;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'prenom' => $user->prenom,
                'email' => $user->email,
                'email_verifie' => $user->email_verified_at !== null,
            ],
            'token' => $token,
        ], 201);
    }
}
