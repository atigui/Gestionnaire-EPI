<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employe extends Model
{
    protected $fillable = ['matricule', 'personne_id'];

    public function personne()
    {
        return $this->belongsTo(Personne::class);
    }

    public function affectations()
    {
        return $this->hasMany(Affectation::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }
}

