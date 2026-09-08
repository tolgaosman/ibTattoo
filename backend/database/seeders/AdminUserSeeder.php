<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Seed the single admin account used by the Next.js admin panel.
     */
    public function run(): void
    {
        $email = env('ADMIN_EMAIL', 'irmakyamuer2000@gmail.com');
        $password = env('ADMIN_PASSWORD', 'change-me');

        User::query()->updateOrCreate(
            ['email' => $email],
            ['name' => 'Irmak Bozkurt', 'password' => $password],
        );
    }
}
