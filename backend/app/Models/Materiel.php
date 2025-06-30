<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Materiel extends Model
{
    protected $fillable = ['description', 'categorie_id', 'frequence_renouvellement'];

    public function stocks()
{
    return $this->hasMany(Stock::class);
}

    public function categorie()
    {
        return $this->belongsTo(Categorie::class);
    }

    public function affectations()
    {
        return $this->hasMany(Affectation::class);
    }
    public function attributions()
{
    return $this->belongsToMany(Attribution::class, 'attribution_materiel');
}

    public function categoriesAssociees()
{
    return $this->belongsToMany(Categorie::class, 'stocks')
        ->withPivot('quantite')
        ->distinct();
}
}
