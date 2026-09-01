<?php

namespace Tests\Feature;

use App\Mail\PasswordResetMail;
use App\Models\PasswordResetCode;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    private function createUser(): User
    {
        return User::create([
            'prenom' => 'Alexis',
            'email' => 'perso@alexislesieur.fr',
            'password' => 'Password123!',
            'email_verified_at' => now(),
        ]);
    }

    public function test_demande_de_reset_reussie(): void
    {
        Mail::fake();

        $user = $this->createUser();

        $response = $this->postJson('/api/password/forgot', [
            'email' => $user->email,
        ]);

        $response
            ->assertOk()
            ->assertJson([
                'message' => 'Si cette adresse email correspond à un compte, un code a été envoyé.',
            ]);

        $this->assertDatabaseHas(
            'password_reset_codes',
            [
                'user_id' => $user->id,
            ]
        );

        Mail::assertSent(PasswordResetMail::class);
    }

    public function test_demande_de_reset_refusee_si_email_manquant(): void
    {
        $response = $this->postJson('/api/password/forgot', []);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors([
                'email',
            ]);
    }

    public function test_demande_de_reset_refusee_si_email_invalide(): void
    {
        $response = $this->postJson('/api/password/forgot', [
            'email' => 'email-invalide',
        ]);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors([
                'email',
            ]);
    }

    public function test_demande_de_reset_refusee_si_utilisateur_inexistant(): void
    {
        $response = $this->postJson('/api/password/forgot', [
            'email' => 'inconnu@example.com',
        ]);

        $response
            ->assertOk()
            ->assertJson([
                'message' => 'Si cette adresse email correspond à un compte, un code a été envoyé.',
            ]);
    }

    public function test_code_de_reset_valide(): void
    {
        $user = $this->createUser();

        PasswordResetCode::create([
            'user_id' => $user->id,
            'code' => '123456',
            'expires_at' => now()->addMinutes(10),
        ]);

        $response = $this->postJson('/api/password/verify', [
            'email' => $user->email,
            'code' => '123456',
        ]);

        $response
            ->assertOk()
            ->assertJson([
                'message' => 'Code de vérification valide.',
            ]);
    }

    public function test_code_de_reset_invalide(): void
    {
        $user = $this->createUser();

        PasswordResetCode::create([
            'user_id' => $user->id,
            'code' => '123456',
            'expires_at' => now()->addMinutes(10),
        ]);

        $response = $this->postJson('/api/password/verify', [
            'email' => $user->email,
            'code' => '999999',
        ]);

        $response->assertStatus(422);
    }

    public function test_code_de_reset_expire(): void
    {
        $user = $this->createUser();

        PasswordResetCode::create([
            'user_id' => $user->id,
            'code' => '123456',
            'expires_at' => now()->subMinute(),
        ]);

        $response = $this->postJson('/api/password/verify', [
            'email' => $user->email,
            'code' => '123456',
        ]);

        $response->assertStatus(422);
    }

    public function test_reset_du_mot_de_passe_reussi(): void
    {
        $user = $this->createUser();

        PasswordResetCode::create([
            'user_id' => $user->id,
            'code' => '123456',
            'expires_at' => now()->addMinutes(10),
        ]);

        $response = $this->postJson('/api/password/reset', [
            'email' => $user->email,
            'code' => '123456',
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ]);

        $response
            ->assertOk()
            ->assertJson([
                'message' => 'Votre mot de passe a été réinitialisé avec succès.',
            ]);

        $user->refresh();

        $this->assertTrue(
            Hash::check(
                'NewPassword123!',
                $user->password
            )
        );
    }

    public function test_reset_refuse_si_confirmation_differente(): void
    {
        $user = $this->createUser();

        PasswordResetCode::create([
            'user_id' => $user->id,
            'code' => '123456',
            'expires_at' => now()->addMinutes(10),
        ]);

        $response = $this->postJson('/api/password/reset', [
            'email' => $user->email,
            'code' => '123456',
            'password' => 'NewPassword123!',
            'password_confirmation' => 'WrongPassword123!',
        ]);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors([
                'password',
            ]);
    }

    public function test_reset_refuse_si_code_invalide(): void
    {
        $user = $this->createUser();

        PasswordResetCode::create([
            'user_id' => $user->id,
            'code' => '123456',
            'expires_at' => now()->addMinutes(10),
        ]);

        $response = $this->postJson('/api/password/reset', [
            'email' => $user->email,
            'code' => '999999',
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ]);

        $response->assertStatus(422);
    }

    public function test_reset_refuse_si_code_expire(): void
    {
        $user = $this->createUser();

        PasswordResetCode::create([
            'user_id' => $user->id,
            'code' => '123456',
            'expires_at' => now()->subMinute(),
        ]);

        $response = $this->postJson('/api/password/reset', [
            'email' => $user->email,
            'code' => '123456',
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ]);

        $response->assertStatus(422);
    }

    public function test_code_de_reset_est_supprime_apres_reinitialisation(): void
    {
        $user = $this->createUser();

        $resetCode = PasswordResetCode::create([
            'user_id' => $user->id,
            'code' => '123456',
            'expires_at' => now()->addMinutes(10),
        ]);

        $this->postJson('/api/password/reset', [
            'email' => $user->email,
            'code' => '123456',
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ])->assertOk();

        $this->assertDatabaseMissing(
            'password_reset_codes',
            [
                'id' => $resetCode->id,
            ]
        );
    }

    public function test_ancien_mot_de_passe_ne_fonctionne_plus(): void
    {
        $user = $this->createUser();

        PasswordResetCode::create([
            'user_id' => $user->id,
            'code' => '123456',
            'expires_at' => now()->addMinutes(10),
        ]);

        $this->postJson('/api/password/reset', [
            'email' => $user->email,
            'code' => '123456',
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ])->assertOk();

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'Password123!',
        ]);

        $response->assertStatus(401);
    }

    public function test_nouveau_mot_de_passe_permet_de_se_connecter(): void
    {
        $user = $this->createUser();

        PasswordResetCode::create([
            'user_id' => $user->id,
            'code' => '123456',
            'expires_at' => now()->addMinutes(10),
        ]);

        $this->postJson('/api/password/reset', [
            'email' => $user->email,
            'code' => '123456',
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ])->assertOk();

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'NewPassword123!',
        ]);

        $response->assertOk();

        $response->assertJsonStructure([
            'user',
            'token',
        ]);
    }
}
