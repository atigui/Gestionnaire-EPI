<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\FicheAttributionController;


Route::middleware('auth:sanctum')->get('/', function (Request $request) {
    return $request->user();
});



Route::post('/login', [AuthenticatedSessionController::class, 'store']);


Route::post('/register', [RegisteredUserController::class, 'store']);

Route::get('/fiche-attribution/{id}', [FicheAttributionController::class, 'genererFiche']);
