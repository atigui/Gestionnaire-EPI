<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Personne;

class PersonneSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Désactiver les contraintes de clé étrangère
        \DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Vider la table personnes (et autres tables liées si nécessaire)
        Personne::truncate();

        // Réactiver les contraintes de clé étrangère
        \DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Ajouter les données dans la table personnes
        Personne::create([
            'nom' => 'Test Nom',
            'prenom' => 'Test Prenom',
            'email' => 'test.nom@example.com',
            'mot_de_passe' => bcrypt('password'),
            'type' => 'employe', // Par exemple
        ]);
    }
}
