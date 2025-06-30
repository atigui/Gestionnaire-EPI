<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Affectation;
use App\Models\Employe;
use App\Models\Materiel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AffectationController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'employe_id' => 'required|exists:employes,id',
            'materiel_id' => 'required|exists:materiels,id',
            'date_affectation' => 'required|date',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
        $affectation = Affectation::create([
            'employe_id' => $request->employe_id,
            'materiel_id' => $request->materiel_id,
            'date_affectation' => $request->date_affectation,
        ]);
        return response()->json([
            'message' => 'Affectation créée avec succès',
            'affectation' => $affectation
        ], 201);
    }
    public function index()
{
    return response()->json(
        Affectation::with(['employe', 'materiel.categorie'])->get()
    );
}
}