<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Personne;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Role;


class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'mot_de_passe' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $personne = Personne::where('email', $request->email)->first();

        if (!$personne || !Hash::check($request->mot_de_passe, $personne->mot_de_passe)) {
            return response()->json(['message' => 'Email ou mot de passe incorrect.'], 401);
        }

        $token = $personne->createToken('API Token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'role' => $personne->getRoleNames()->first() // retourne le nom du rôle
        ]);
    }

    public function register(Request $request)
    {
       
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|email|unique:personnes,email',
            'mot_de_passe' => 'required|string|min:6',
            'role' => 'required|string|in:admin,magasinier,affecteur',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $roleModel = \Spatie\Permission\Models\Role::where('name', $request->role)->first();

        if (!$roleModel) {
            return response()->json(['message' => 'Rôle invalide'], 400);
        }

        $personne = Personne::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'mot_de_passe' => Hash::make($request->mot_de_passe),
            'type' => $request->role, // Utiliser le rôle comme type pour cohérence
        ]);

        $personne->assignRole($request->role);

        $token = $personne->createToken('API Token')->plainTextToken;

        return response()->json([
            'message' => 'Utilisateur créé avec succès',
            'token' => $token,
            'role' => $request->role,
        ]);
    }
}
