<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'destinataire_id',
        'type_notification',
        'message',
        'date_envoi',
    ];

    public function destinataire()
    {
        return $this->belongsTo(Personne::class, 'destinataire_id');
    }
}
