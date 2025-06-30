<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Personne;

class Role extends Model
{
    use HasFactory;

    protected $fillable = ['nom'];

    public function personnes()
    {
        return $this->hasMany(Personne::class);
    }
}
