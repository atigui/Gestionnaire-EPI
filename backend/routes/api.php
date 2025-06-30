<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;  
use App\Http\Controllers\CategorieController;
use App\Http\Controllers\MaterielController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\AttributionController;
use App\Http\Controllers\AffectationController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\TestRoleController;
use App\Http\Controllers\Auth\PasswordResetLinkController;


// Auth publique
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);


// Authentification requise
// Authentification requise
Route::middleware('auth:sanctum')->group(function () {

    // Utilisateur connecté
    Route::post('/logout', [AuthController::class, 'logout']);

    // Toutes les routes accessibles sans vérification de rôle
    Route::apiResource('categories', CategorieController::class);
    Route::apiResource('materiels', MaterielController::class);
    Route::post('/stocks', [StockController::class, 'store']);

    Route::post('/affectations', [AffectationController::class, 'store']);
    Route::post('/attributions', [AttributionController::class, 'store']);

    Route::get('/materiels/{id}/stock', [StockController::class, 'showByMateriel']);
    Route::get('/materiels/{id}/categories', [MaterielController::class, 'categoriesAssociees']);
    Route::get('/materiels/{id}/details', [MaterielController::class, 'details']);
    Route::get('/materiels/{id}/historique', [MaterielController::class, 'historique']);
    Route::get('/affectations', [AffectationController::class, 'index']);
    Route::get('/employes/{id}/attributions', [AttributionController::class, 'historique']);
    Route::get('/notifications', [NotificationController::class, 'index']);

    Route::get('/user', function (Request $request) {
        return $request->user()->load('roles');
    });
    
});
