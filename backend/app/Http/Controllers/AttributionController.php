<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Attribution;
use App\Models\Affectation;
use App\Models\Notification;
use App\Models\Personne;
use App\Models\Stock;
use Carbon\Carbon;

class AttributionController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'affectation_id' => 'required|exists:affectations,id',
            'date_attribution' => 'required|date',
        ]);
     

        $affectation = Affectation::with('materiel.categorie')->find($request->affectation_id);

        if (!$affectation) {
            return response()->json(['message' => 'Affectation non trouvée'], 404);
        }

        
        $categorieId = $affectation->materiel->categorie_id;

      
        $stock = Stock::where('materiel_id', $affectation->materiel_id)
                      ->where('categorie_id', $categorieId)
                      ->first();

            if (!$stock || $stock->quantite < 1) {                       
            return response()->json(['message' => 'Stock insuffisant pour ce matériel'], 400);
        }
$attribution = Attribution::create([
    'affectation_id' => $request->affectation_id,
    'date_attribution' => Carbon::parse($request->date_attribution),
]);
$attribution->materiels()->attach($affectation->materiel_id);
$stock->decrement('quantite');
$responsables = Personne::whereIn('type', ['administrateur', 'magasinier'])->get();
foreach ($responsables as $destinataire) {
    Notification::create([
        'destinataire_id' => $destinataire->id,
        'type_notification' => 'Attribution réussie',
        'message' => 'Une attribution a été faite pour l’employé ID ' . $affectation->employe_id .
             ' - Matériel : ' . $affectation->materiel->description .
             ' - Catégorie : ' . $affectation->materiel->categorie->nom,
        'date_envoi' => Carbon::now(),
    ]);
}
if ($stock->quantite < 5) {
    foreach ($responsables as $destinataire) {
        Notification::create([
            'destinataire_id' => $destinataire->id,
            'type_notification' => 'Stock critique',
           'message' => 'Stock faible pour le matériel : ' . $affectation->materiel->description .
             ' - Catégorie : ' . $affectation->materiel->categorie->nom .
             ' (reste : ' . $stock->quantite . ' unités)',
            'date_envoi' => Carbon::now(),
        ]);
    }
}
return response()->json([
    'message' => 'Attribution enregistrée avec succès',
    'attribution' => $attribution
], 201);
    }
    public function historique($employeId)
{
    $attributions = Attribution::with([
        'affectation.materiel.categorie',
        'ficheAttribution'
    ])
    ->whereHas('affectation', function ($query) use ($employeId) {
        $query->where('employe_id', $employeId);
    })
    ->orderByDesc('date_attribution')
    ->get();
    $resultat = $attributions->map(function ($attribution) {
        $materiel = $attribution->affectation->materiel;
        return [
            'date_attribution' => \Carbon\Carbon::parse($attribution->date_attribution)->format('Y-m-d'),
            'materiel' => $materiel->description,
            'categorie' => $materiel->categorie->nom ?? 'Non défini',
            'fiche_pdf' => $attribution->ficheAttribution->chemin_fichier ?? null,
        ];
    });
    return response()->json([
        'employe_id' => $employeId,
        'historique' => $resultat
    ]);
}
}