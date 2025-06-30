<?php
namespace App\Http\Controllers;
use App\Models\Materiel;
use Illuminate\Http\Request;

class MaterielController extends Controller
{ 
    public function index(Request $request)
    {
        $materiels = Materiel::with('categorie')
            ->when($request->filled('description'), function ($query) use ($request) {
                $query->where('description', 'like', '%' . $request->description . '%');
            })
            ->when($request->filled('categorie_id'), function ($query) use ($request) {
                $query->where('categorie_id', $request->categorie_id);
            })
            ->when($request->filled('frequence'), function ($query) use ($request) {
                $query->where('frequence_renouvellement', $request->frequence);
            })
            ->get();
    
        return response()->json([
            'materiels' => $materiels
        ]);
    }    
    public function store(Request $request)
    {
        $request->validate([
            'description' => 'required|string',
            'categorie_id' => 'required|exists:categories,id',
            'frequence_renouvellement' => 'required|string'
        ]);
        return Materiel::create($request->all());
    }
    public function show($id)
    {
        return Materiel::with('categorie')->findOrFail($id);
    }
    public function update(Request $request, $id)
    {
        $materiel = Materiel::findOrFail($id);
        $materiel->update($request->all());
        return $materiel;
    }
    public function destroy($id)
    {
        $materiel = Materiel::findOrFail($id);
        $materiel->delete();
        return response()->json(['message' => 'Matériel supprimé']);
    }
    public function categoriesAssociees($id)
{
    $materiel = Materiel::findOrFail($id);
    $categories = $materiel->categoriesAssociees()->get();
    return response()->json([
        'materiel' => $materiel->description,
        'categories' => $categories
    ]);
}
public function details($id)
{
    $materiel = Materiel::with('categorie')->findOrFail($id);
    $stocks = \App\Models\Stock::where('materiel_id', $id)
        ->with('categorie')
        ->get()
        ->map(function ($stock) {
            return [
                'categorie' => $stock->categorie->nom,
                'quantite' => $stock->quantite,
            ];
        });
    return response()->json([
        'id' => $materiel->id,
        'description' => $materiel->description,
        'frequence_renouvellement' => $materiel->frequence_renouvellement,
        'stocks' => $stocks,
    ]);
}
public function historique($id)
{
    $attributions = \App\Models\Attribution::whereHas('materiels', function ($query) use ($id) {
        $query->where('materiel_id', $id);
    })
    ->with(['affectation.employe', 'categorie', 'fiche']) 
    ->orderByDesc('date_attribution')
    ->get()
    ->map(function ($attr) {
        return [
            'employe' => $attr->affectation->employe->nom . ' ' . $attr->affectation->employe->prenom,
            'date_attribution' => $attr->date_attribution,
            'categorie' => $attr->categorie->nom,
            'fiche_pdf' => optional($attr->fiche)->chemin_pdf
        ];
    });
    return response()->json([
        'materiel_id' => $id,
        'historique' => $attributions
    ]);
}
}