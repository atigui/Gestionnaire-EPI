<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    /**
     * Gérer la requête entrante.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $role
     * @return mixed
     */
    public function handle(Request $request, Closure $next, $role)
    {
        // Vérifie si l'utilisateur est authentifié et s'il a le rôle requis
        if (!auth()->check() || !auth()->user()->hasRole($role)) {
            // Si l'utilisateur n'a pas le rôle, renvoyer une réponse 403
            return response()->json(['message' => 'Accès interdit'], 403);
        }

        return $next($request);
    }
}

