<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EmailVerificationController;
use App\Http\Controllers\Api\OnboardingController;
use App\Http\Controllers\Api\PasswordResetController;
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

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::patch('/onboarding/name', [
        OnboardingController::class,
        'complete',
    ]);
});

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
    ]);
});
