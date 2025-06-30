<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $roles = ['admin', 'consultant', 'affecteur', 'magasinier'];

        foreach ($roles as $role) {
            if (!Role::where('name', $role)->where('guard_name', 'api')->exists()) {
                Role::create([
                    'name' => $role,
                    'guard_name' => 'api'
                ]);
            }
        }
    }
}
