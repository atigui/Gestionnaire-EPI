<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        // Appel du seeder de rôles
        $this->call(RoleSeeder::class);
        $this->call([
            PersonneSeeder::class,
        ]);
    }
}
