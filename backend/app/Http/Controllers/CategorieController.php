<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CategorieController extends Controller
{
    
    public function index()
    {
        return Categorie::all(); // Liste de toutes les catégories
    }

    public function store(Request $request)
    {
        $request->validate(['nom' => 'required|string|unique:categories']);
        return Categorie::create($request->all());
    }

    public function show($id)
    {
        return Categorie::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $categorie = Categorie::findOrFail($id);
        $categorie->update($request->all());
        return $categorie;
    }

    public function destroy($id)
    {
        $categorie = Categorie::findOrFail($id);
        $categorie->delete();
        return response()->json(['message' => 'Catégorie supprimée']);
    }
}
