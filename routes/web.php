<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Menus/Index');
});

// Pastikan semua route yang menggunakan Inertia mengembalikan Inertia response
Route::fallback(function () {
    return Inertia::render('Menus/Index');
});
