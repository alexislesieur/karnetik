<?php

use App\Models\User;

test('inscription reussie retourne un token', function () {
    $response = $this->postJson('/api/register', [
        'prenom' => 'Alexis',
        'email' => 'alexis@example.com',
        'password' => 'MotDePasse1!',
        'password_confirmation' => 'MotDePasse1!',
    ]);

    $response->assertCreated()
        ->assertJsonStructure([
            'user' => ['id', 'prenom', 'email', 'email_verifie'],
            'token',
        ]);

    $this->assertDatabaseHas('users', [
        'email' => 'alexis@example.com',
    ]);
});
