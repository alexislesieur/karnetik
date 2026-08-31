<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EmailVerificationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

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

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
    ]);
});
