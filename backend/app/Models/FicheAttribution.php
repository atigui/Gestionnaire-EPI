<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FicheAttribution extends Model
{
    protected $fillable = ['attribution_id', 'date_generation', 'format', 'chemin_fichier'];

    public function attribution()
    {
        return $this->belongsTo(Attribution::class);
    }
}

