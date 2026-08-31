<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('connexion reussie retourne un token', function () {
    $user = User::factory()->create([
        'email' => 'alexis@example.com',
        'password' => Hash::make('MotDePasse1!'),
        'email_verified_at' => now(),
    ]);

    $response = $this->postJson('/api/login', [
        'email' => 'alexis@example.com',
        'password' => 'MotDePasse1!',
    ]);

    $response->assertOk()
        ->assertJsonStructure([
            'user' => [
                'id',
                'prenom',
                'email',
                'email_verifie',
            ],
            'token',
        ])
        ->assertJson([
            'user' => [
                'id' => $user->id,
                'email' => 'alexis@example.com',
                'email_verifie' => true,
            ],
        ]);
});

test('connexion refusee si email inexistant', function () {
    $response = $this->postJson('/api/login', [
        'email' => 'inconnu@example.com',
        'password' => 'MotDePasse1!',
    ]);

    $response->assertUnauthorized()
        ->assertJson([
            'message' => 'Email ou mot de passe incorrect.',
        ]);
});

test('connexion refusee si mot de passe incorrect', function () {
    User::factory()->create([
        'email' => 'alexis@example.com',
        'password' => Hash::make('MotDePasse1!'),
        'email_verified_at' => now(),
    ]);

    $response = $this->postJson('/api/login', [
        'email' => 'alexis@example.com',
        'password' => 'MauvaisMotDePasse1!',
    ]);

    $response->assertUnauthorized()
        ->assertJson([
            'message' => 'Email ou mot de passe incorrect.',
        ]);
});

test('connexion refusee si email non verifie', function () {
    User::factory()->create([
        'email' => 'alexis@example.com',
        'password' => Hash::make('MotDePasse1!'),
        'email_verified_at' => null,
    ]);

    $response = $this->postJson('/api/login', [
        'email' => 'alexis@example.com',
        'password' => 'MotDePasse1!',
    ]);

    $response->assertForbidden()
        ->assertJson([
            'message' => 'Veuillez vérifier votre adresse email avant de vous connecter.',
        ]);
});

test('connexion refusee si email manquant', function () {
    $response = $this->postJson('/api/login', [
        'password' => 'MotDePasse1!',
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors('email');
});

test('connexion refusee si mot de passe manquant', function () {
    $response = $this->postJson('/api/login', [
        'email' => 'alexis@example.com',
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors('password');
});
