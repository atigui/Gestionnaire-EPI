<?php
namespace App\Http\Controllers;
use App\Models\Stock;
use App\Models\Materiel;
use Illuminate\Http\Request;
class StockController extends Controller
{
    public function store(Request $request)
{
    $request->validate([
        'materiel_id' => 'required|exists:materiels,id',
        'categorie_id' => 'required|exists:categories,id',
        'quantite' => 'required|integer|min:1',
    ]);
    $stock = Stock::firstOrCreate(
        [
            'materiel_id' => $request->materiel_id,
            'categorie_id' => $request->categorie_id,
        ],
        ['quantite' => 0]
    );
    $stock->increment('quantite', $request->quantite);

    return response()->json(['message' => 'Stock ajouté avec succès.', 'stock' => $stock]);
}
public function showByMateriel($id)
{
    $materiel = Materiel::with(['stocks.categorie'])->findOrFail($id);
    $details = $materiel->stocks->map(function ($stock) {
        return [
            'categorie' => $stock->categorie->nom,
            'quantite' => $stock->quantite
        ];
    });
    return response()->json([
        'materiel' => $materiel->description,
        'stocks_par_categorie' => $details
    ]);
}
}