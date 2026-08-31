<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Mail\EmailVerificationMail;
use App\Models\EmailVerificationCode;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::create([
            'prenom' => $validated['prenom'] ?? null,
            'email' => $validated['email'],
            'password' => $validated['password'],
        ]);

        $code = $this->createVerificationCode($user);

        Mail::to($user->email)->send(
            new EmailVerificationMail($code)
        );

        $token = $user->createToken('karnetik-mobile')
            ->plainTextToken;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'prenom' => $user->prenom,
                'email' => $user->email,
                'email_verifie' => false,
            ],
            'token' => $token,
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::where(
            'email',
            $validated['email']
        )->first();

        if (
            !$user ||
            !Hash::check(
                $validated['password'],
                $user->password
            )
        ) {
            return response()->json([
                'message' => 'Email ou mot de passe incorrect.',
            ], 401);
        }

        if ($user->email_verified_at === null) {
            $code = $this->createVerificationCode($user);

            Mail::to($user->email)->send(
                new EmailVerificationMail($code)
            );

            return response()->json([
                'message' => 'Veuillez vérifier votre adresse email avant de vous connecter.',
                'email_verifie' => false,
            ], 403);
        }

        $token = $user->createToken('karnetik-mobile')
            ->plainTextToken;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'prenom' => $user->prenom,
                'email' => $user->email,
                'email_verifie' => true,
            ],
            'token' => $token,
        ]);
    }

    private function createVerificationCode(User $user): string
    {
        $code = (string) random_int(100000, 999999);

        EmailVerificationCode::updateOrCreate(
            ['user_id' => $user->id],
            [
                'code' => $code,
                'expires_at' => now()->addMinutes(10),
            ]
        );

        return $code;
    }
}
