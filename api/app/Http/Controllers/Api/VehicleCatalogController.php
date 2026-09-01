<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VehicleBrand;
use Illuminate\Http\JsonResponse;

class VehicleCatalogController extends Controller
{
    public function brands(): JsonResponse
    {
        $brands = VehicleBrand::query()
            ->where('actif', true)
            ->orderBy('nom')
            ->get([
                'id',
                'nom',
            ]);

        return response()->json([
            'brands' => $brands,
        ]);
    }

    public function models(VehicleBrand $brand): JsonResponse
    {
        abort_unless($brand->actif, 404);

        $models = $brand->models()
            ->where('actif', true)
            ->orderBy('nom')
            ->get([
                'id',
                'nom',
            ]);

        return response()->json([
            'brand' => [
                'id' => $brand->id,
                'nom' => $brand->nom,
            ],
            'models' => $models,
        ]);
    }
}
