<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ForgotPasswordRequest;
use App\Http\Requests\ResetPasswordRequest;
use App\Http\Requests\VerifyPasswordResetRequest;
use App\Mail\PasswordResetMail;
use App\Models\PasswordResetCode;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class PasswordResetController extends Controller
{
    public function forgot(
        ForgotPasswordRequest $request
    ): JsonResponse {
        $validated = $request->validated();

        $user = User::where(
            'email',
            $validated['email']
        )->first();

        /*
         * On retourne la même réponse même si l'adresse
         * n'existe pas afin de ne pas révéler les comptes
         * présents dans l'application.
         */
        if (!$user) {
            return response()->json([
                'message' => 'Si cette adresse email correspond à un compte, un code a été envoyé.',
            ]);
        }

        $code = (string) random_int(100000, 999999);

        PasswordResetCode::updateOrCreate(
            [
                'user_id' => $user->id,
            ],
            [
                'code' => $code,
                'expires_at' => now()->addMinutes(10),
            ]
        );

        Mail::to($user->email)->send(
            new PasswordResetMail($code)
        );

        return response()->json([
            'message' => 'Si cette adresse email correspond à un compte, un code a été envoyé.',
        ]);
    }

    public function verify(
        VerifyPasswordResetRequest $request
    ): JsonResponse {
        $validated = $request->validated();

        $user = User::where(
            'email',
            $validated['email']
        )->first();

        if (!$user) {
            return response()->json([
                'message' => 'Code de vérification incorrect.',
            ], 422);
        }

        $resetCode = PasswordResetCode::where(
            'user_id',
            $user->id
        )->first();

        if (!$resetCode) {
            return response()->json([
                'message' => 'Aucun code de réinitialisation actif.',
            ], 422);
        }

        if ($resetCode->expires_at->isPast()) {
            return response()->json([
                'message' => 'Ce code de réinitialisation a expiré.',
            ], 422);
        }

        if ($resetCode->code !== $validated['code']) {
            return response()->json([
                'message' => 'Code de vérification incorrect.',
            ], 422);
        }

        return response()->json([
            'message' => 'Code de vérification valide.',
        ]);
    }

    public function reset(
        ResetPasswordRequest $request
    ): JsonResponse {
        $validated = $request->validated();

        $user = User::where(
            'email',
            $validated['email']
        )->first();

        if (!$user) {
            return response()->json([
                'message' => 'Code de vérification incorrect.',
            ], 422);
        }

        $resetCode = PasswordResetCode::where(
            'user_id',
            $user->id
        )->first();

        if (!$resetCode) {
            return response()->json([
                'message' => 'Aucun code de réinitialisation actif.',
            ], 422);
        }

        if ($resetCode->expires_at->isPast()) {
            return response()->json([
                'message' => 'Ce code de réinitialisation a expiré.',
            ], 422);
        }

        if ($resetCode->code !== $validated['code']) {
            return response()->json([
                'message' => 'Code de vérification incorrect.',
            ], 422);
        }

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        $resetCode->delete();

        /*
         * On invalide également les anciens tokens Sanctum.
         * Une session mobile existante ne doit pas rester active
         * après une modification du mot de passe.
         */
        $user->tokens()->delete();

        return response()->json([
            'message' => 'Votre mot de passe a été réinitialisé avec succès.',
        ]);
    }
}
