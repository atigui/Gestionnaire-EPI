<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Attribution extends Model
{
    use HasFactory;

    protected $fillable = ['affectation_id', 'date_attribution'];

    public function affectation()
    {
        return $this->belongsTo(Affectation::class);
    }

    public function ficheAttribution()
    {
        return $this->hasOne(FicheAttribution::class);
    }
    public function materiels()
    {
        return $this->belongsToMany(Materiel::class, 'attribution_materiel');
    }
    public function materiel()
{
    return $this->affectation->materiel;
}
}
