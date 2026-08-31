<?php

use App\Mail\EmailVerificationMail;
use App\Models\EmailVerificationCode;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

test('verification email reussie avec un code valide', function () {
    $user = User::factory()->create([
        'email' => 'alexis@example.com',
        'email_verified_at' => null,
    ]);

    EmailVerificationCode::create([
        'user_id' => $user->id,
        'code' => '123456',
        'expires_at' => now()->addMinutes(10),
    ]);

    $response = $this->postJson('/api/email/verify', [
        'email' => 'alexis@example.com',
        'code' => '123456',
    ]);

    $response->assertOk()
        ->assertJson([
            'message' => 'Adresse email vérifiée avec succès.',
            'user' => [
                'email' => 'alexis@example.com',
                'email_verifie' => true,
            ],
        ]);

    expect($user->fresh()->email_verified_at)
        ->not->toBeNull();

    $this->assertDatabaseMissing(
        'email_verification_codes',
        [
            'user_id' => $user->id,
        ],
    );
});

test('verification email refusee avec un code incorrect', function () {
    $user = User::factory()->create([
        'email' => 'alexis@example.com',
        'email_verified_at' => null,
    ]);

    EmailVerificationCode::create([
        'user_id' => $user->id,
        'code' => '123456',
        'expires_at' => now()->addMinutes(10),
    ]);

    $response = $this->postJson('/api/email/verify', [
        'email' => 'alexis@example.com',
        'code' => '654321',
    ]);

    $response->assertUnprocessable()
        ->assertJson([
            'message' => 'Le code de vérification est incorrect.',
        ]);

    expect($user->fresh()->email_verified_at)
        ->toBeNull();
});

test('verification email refusee avec un code expire', function () {
    $user = User::factory()->create([
        'email' => 'alexis@example.com',
        'email_verified_at' => null,
    ]);

    EmailVerificationCode::create([
        'user_id' => $user->id,
        'code' => '123456',
        'expires_at' => now()->subMinute(),
    ]);

    $response = $this->postJson('/api/email/verify', [
        'email' => 'alexis@example.com',
        'code' => '123456',
    ]);

    $response->assertUnprocessable()
        ->assertJson([
            'message' => 'Ce code de vérification a expiré.',
        ]);

    expect($user->fresh()->email_verified_at)
        ->toBeNull();
});

test('verification email refusee si utilisateur deja verifie', function () {
    $user = User::factory()->create([
        'email' => 'alexis@example.com',
        'email_verified_at' => now(),
    ]);

    $response = $this->postJson('/api/email/verify', [
        'email' => 'alexis@example.com',
        'code' => '123456',
    ]);

    $response->assertUnprocessable()
        ->assertJson([
            'message' => 'Cette adresse email est déjà vérifiée.',
        ]);
});

test('renvoi du code de verification reussi', function () {
    Mail::fake();

    $user = User::factory()->create([
        'email' => 'alexis@example.com',
        'email_verified_at' => null,
    ]);

    $response = $this->postJson('/api/email/resend', [
        'email' => 'alexis@example.com',
    ]);

    $response->assertOk()
        ->assertJson([
            'message' => 'Un nouveau code a été envoyé.',
        ]);

    $this->assertDatabaseHas(
        'email_verification_codes',
        [
            'user_id' => $user->id,
        ],
    );

    Mail::assertSent(
        EmailVerificationMail::class,
        function ($mail) use ($user) {
            return $mail->hasTo($user->email);
        },
    );
});

test('renvoi du code refuse si email deja verifie', function () {
    Mail::fake();

    User::factory()->create([
        'email' => 'alexis@example.com',
        'email_verified_at' => now(),
    ]);

    $response = $this->postJson('/api/email/resend', [
        'email' => 'alexis@example.com',
    ]);

    $response->assertUnprocessable()
        ->assertJson([
            'message' => 'Cette adresse email est déjà vérifiée.',
        ]);

    Mail::assertNothingSent();
});

test('verification email refusee si code invalide', function () {
    $user = User::factory()->create([
        'email' => 'alexis@example.com',
        'email_verified_at' => null,
    ]);

    $response = $this->postJson('/api/email/verify', [
        'email' => $user->email,
        'code' => '12345',
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors('code');
});

test('renvoi du code refuse si email manquant', function () {
    $response = $this->postJson('/api/email/resend', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors('email');
});
