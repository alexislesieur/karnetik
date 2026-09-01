<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CompleteOnboardingRequest;
use Illuminate\Http\JsonResponse;

class OnboardingController extends Controller
{
    public function complete(
        CompleteOnboardingRequest $request
    ): JsonResponse {
        $user = $request->user();

        $user->update([
            'prenom' => $request->validated('prenom'),
            'onboarding_completed' => true,
        ]);

        $user->refresh();

        return response()->json([
            'message' => 'Onboarding terminé avec succès.',
            'user' => [
                'id' => $user->id,
                'prenom' => $user->prenom,
                'email' => $user->email,
                'email_verifie' => $user->email_verified_at !== null,
                'onboarding_completed' => $user->onboarding_completed,
            ],
        ]);
    }
}
