<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Affectation extends Model
{
    use HasFactory;

    protected $fillable = ['employe_id', 'materiel_id', 'date_affectation'];

    public function employe()
    {
        return $this->belongsTo(Employe::class);
    }

    public function materiel()
    {
        return $this->belongsTo(Materiel::class);
    }

    public function attribution()
    {
        return $this->hasOne(Attribution::class);
    }
}
