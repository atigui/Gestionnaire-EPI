<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    protected $fillable = ['materiel_id', 'categorie_id', 'quantite'];

    public function materiel()
    {
        return $this->belongsTo(Materiel::class);
    }

    public function categorie()
    {
        return $this->belongsTo(Categorie::class);
    }
}

