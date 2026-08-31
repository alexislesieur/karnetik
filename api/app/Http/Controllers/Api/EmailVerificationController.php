<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ResendVerificationRequest;
use App\Http\Requests\VerifyEmailRequest;
use App\Mail\EmailVerificationMail;
use App\Models\EmailVerificationCode;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;

class EmailVerificationController extends Controller
{
    public function verify(
        VerifyEmailRequest $request
    ): JsonResponse {
        $validated = $request->validated();

        $user = User::where(
            'email',
            $validated['email']
        )->firstOrFail();

        if ($user->email_verified_at !== null) {
            return response()->json([
                'message' => 'Cette adresse email est déjà vérifiée.',
            ], 422);
        }

        $verification = EmailVerificationCode::where(
            'user_id',
            $user->id
        )->first();

        if (!$verification) {
            return response()->json([
                'message' => 'Aucun code de vérification actif.',
            ], 422);
        }

        if ($verification->expires_at->isPast()) {
            return response()->json([
                'message' => 'Ce code de vérification a expiré.',
            ], 422);
        }

        if ($verification->code !== $validated['code']) {
            return response()->json([
                'message' => 'Le code de vérification est incorrect.',
            ], 422);
        }

        $user->update([
            'email_verified_at' => now(),
        ]);

        $verification->delete();

        return response()->json([
            'message' => 'Adresse email vérifiée avec succès.',
            'user' => [
                'id' => $user->id,
                'prenom' => $user->prenom,
                'email' => $user->email,
                'email_verifie' => true,
            ],
        ]);
    }

    public function resend(
        ResendVerificationRequest $request
    ): JsonResponse {
        $validated = $request->validated();

        $user = User::where(
            'email',
            $validated['email']
        )->firstOrFail();

        if ($user->email_verified_at !== null) {
            return response()->json([
                'message' => 'Cette adresse email est déjà vérifiée.',
            ], 422);
        }

        $code = (string) random_int(100000, 999999);

        EmailVerificationCode::updateOrCreate(
            ['user_id' => $user->id],
            [
                'code' => $code,
                'expires_at' => now()->addMinutes(10),
            ]
        );

        Mail::to($user->email)->send(
            new EmailVerificationMail($code)
        );

        return response()->json([
            'message' => 'Un nouveau code a été envoyé.',
        ]);
    }
}
