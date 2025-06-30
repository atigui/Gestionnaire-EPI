<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FicheAttribution;
use App\Models\Attribution;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class FicheAttributionController extends Controller
{
    public function genererFiche($attributionId)
    {
        // On récupère attribution + affectation + materiel + categorie + employé
        $attribution = Attribution::with([
            'affectation.materiel.categorie',
            'affectation.employe'
        ])->findOrFail($attributionId);

        $employe = $attribution->affectation->employe;
        $materiel = $attribution->affectation->materiel;

        // Pour compatibilité avec la vue (liste d’EPI)
        $epies = collect([$materiel]);

        $pdf = Pdf::loadView('fiche_attribution', compact('employe', 'epies'));

        $nomFichier = 'fiche_attribution_' . $attribution->id . '.pdf';
        $chemin = 'fiches/' . $nomFichier;

        Storage::put('public/' . $chemin, $pdf->output());

        // Enregistrement en base
        FicheAttribution::create([
            'attribution_id' => $attribution->id,
            'date_generation' => now(),
            'chemin_fichier' => 'storage/' . $chemin,
        ]);

        return response()->json([
            'message' => 'PDF généré avec succès',
            'chemin' => asset('storage/' . $chemin),
        ]);
    }
}
