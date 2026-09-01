<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CompleteOnboardingRequest;
use App\Http\Requests\CreateVehicleRequest;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class OnboardingController extends Controller
{
    public function completeName(
        CompleteOnboardingRequest $request,
    ): JsonResponse {
        $user = $request->user();

        $user->update([
            'prenom' => $request->validated('prenom'),
            'onboarding_completed' => false,
        ]);

        $user->refresh();

        return response()->json([
            'message' => 'Prénom enregistré avec succès.',
            'user' => [
                'id' => $user->id,
                'prenom' => $user->prenom,
                'email' => $user->email,
                'email_verifie' => $user->email_verified_at !== null,
                'onboarding_completed' => $user->onboarding_completed,
            ],
        ]);
    }

    public function completeVehicle(
        CreateVehicleRequest $request,
    ): JsonResponse {
        $user = $request->user();

        $vehicle = DB::transaction(function () use ($request, $user): Vehicle {
            $vehicle = $user->vehicles()->create([
                'vehicle_brand_id' => $request->validated('vehicle_brand_id'),
                'vehicle_model_id' => $request->validated('vehicle_model_id'),
                'immatriculation' => $request->validated('immatriculation'),
                'kilometrage_actuel' => $request->validated('kilometrage_actuel'),
                'mise_en_circulation' => $request->validated('mise_en_circulation'),
            ]);

            $user->update([
                'onboarding_completed' => true,
            ]);

            return $vehicle;
        });

        $user->refresh();

        $vehicle->load([
            'brand',
            'model',
        ]);

        return response()->json([
            'message' => 'Onboarding terminé avec succès.',
            'user' => [
                'id' => $user->id,
                'prenom' => $user->prenom,
                'email' => $user->email,
                'email_verifie' => $user->email_verified_at !== null,
                'onboarding_completed' => $user->onboarding_completed,
            ],
            'vehicle' => [
                'id' => $vehicle->id,
                'marque' => $vehicle->brand->nom,
                'modele' => $vehicle->model->nom,
                'immatriculation' => $vehicle->immatriculation,
                'kilometrage_actuel' => $vehicle->kilometrage_actuel,
                'mise_en_circulation' => $vehicle->mise_en_circulation?->format('Y-m-d'),
            ],
        ], 201);
    }
}
