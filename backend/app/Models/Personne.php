<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Permission\Traits\HasRoles;



class Personne extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;
    

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'mot_de_passe',
        'type',
    ];

    protected $hidden = [
        'mot_de_passe',
        'remember_token',
    ];

  

    public function getAuthPassword()
    {
        return $this->mot_de_passe;
    }


    public function guardName()
    {
        return 'api';  // Assurez-vous que c’est bien le même que dans config/auth.php
    }
    
}
