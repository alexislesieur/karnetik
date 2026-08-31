<?php

test('health retourne un statut ok', function () {
    $response = $this->getJson('/api/health');

    $response->assertOk()
        ->assertJson([
            'status' => 'ok',
        ]);
});
