<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'app'     => 'Karnetik',
        'version' => '0.1.0-alpha',
        'status'  => 'ok',
    ]);
});