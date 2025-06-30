<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;
use App\Models\Personne;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class NotificationController extends Controller
{
public function store(Request $request)
{
    $request->validate([
        'destinataire_id' => 'required|exists:personnes,id',
        'type_notification' => 'required|string',
        'message' => 'required|string',
    ]);

    $notification = Notification::create([
        'destinataire_id' => $request->destinataire_id,
        'type_notification' => $request->type_notification,
        'message' => $request->message,
        'date_envoi' => Carbon::now(),
    ]);

    return response()->json([
        'message' => 'Notification créée avec succès',
        'notification' => $notification
    ]);
}


public function index()
{
    $user = Auth::user(); // Personne connectée

    $notifications = Notification::where('destinataire_id', $user->id)
                                 ->orderBy('date_envoi', 'desc')
                                 ->get();

    return response()->json([
        'notifications' => $notifications
    ]);
}


}
