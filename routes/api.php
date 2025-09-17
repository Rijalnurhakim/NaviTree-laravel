<?php

use App\Http\Controllers\Api\MenuController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::prefix('menus')->group(function () {
    Route::get('/', [MenuController::class, 'index']); // GET /api/menus
    Route::post('/', [MenuController::class, 'store']); // POST /api/menus
    Route::get('/{id}', [MenuController::class, 'show']); // GET /api/menus/{id}
    Route::put('/{id}', [MenuController::class, 'update']); // PUT /api/menus/{id}
    Route::delete('/{id}', [MenuController::class, 'destroy']); // DELETE /api/menus/{id}
    Route::get('/{id}/children', [MenuController::class, 'children']); // GET /api/menus/{id}/children
    Route::post('/reorder', [MenuController::class, 'reorder']); // POST /api/menus/reorder
});
