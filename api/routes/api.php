<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EmailVerificationController;
use App\Http\Controllers\Api\OnboardingController;
use App\Http\Controllers\Api\PasswordResetController;
use App\Http\Controllers\Api\VehicleCatalogController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [
    AuthController::class,
    'register',
]);

Route::post('/login', [
    AuthController::class,
    'login',
]);

Route::post('/email/verify', [
    EmailVerificationController::class,
    'verify',
]);

Route::post('/email/resend', [
    EmailVerificationController::class,
    'resend',
]);

Route::post('/password/forgot', [
    PasswordResetController::class,
    'forgot',
]);

Route::post('/password/verify', [
    PasswordResetController::class,
    'verify',
]);

Route::post('/password/reset', [
    PasswordResetController::class,
    'reset',
]);

Route::get('/vehicle-brands', [
    VehicleCatalogController::class,
    'brands',
]);

Route::get('/vehicle-brands/{brand}/models', [
    VehicleCatalogController::class,
    'models',
]);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        $user = $request->user();

        return response()->json([
            'id' => $user->id,
            'prenom' => $user->prenom,
            'email' => $user->email,
            'email_verifie' => $user->email_verified_at !== null,
            'onboarding_completed' => $user->onboarding_completed,
        ]);
    });

    Route::patch('/onboarding/name', [
        OnboardingController::class,
        'completeName',
    ]);

    Route::post('/onboarding/vehicle', [
        OnboardingController::class,
        'completeVehicle',
    ]);
});

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
    ]);
});
