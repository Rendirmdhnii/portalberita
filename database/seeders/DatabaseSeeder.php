<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Setting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Default Users
        $users = [
            [
                'name' => 'Redaksi PojokTV',
                'email' => 'redaksi@pojoktv.com',
                'password' => Hash::make('Sidoarjo@79'),
                'role' => 'super_admin',
            ],
            [
                'name' => 'Admin PojokTV',
                'email' => 'admin@pojoktv.com',
                'password' => bcrypt('password'),
                'role' => 'admin',
            ],
            [
                'name' => 'Author PojokTV',
                'email' => 'author@pojoktv.com',
                'password' => bcrypt('password'),
                'role' => 'author',
            ],
            [
                'name' => 'Subscriber PojokTV',
                'email' => 'subscriber@pojoktv.com',
                'password' => bcrypt('password'),
                'role' => 'subscriber',
            ]
        ];

        foreach ($users as $userData) {
            User::updateOrCreate(['email' => $userData['email']], $userData);
        }

        // 2. Create Settings
        Setting::updateOrCreate(
            ['key' => 'site_name'],
            ['value' => 'PojokTV']
        );
        Setting::updateOrCreate(
            ['key' => 'site_description'],
            ['value' => 'Portal Berita Terkini dan Terpercaya']
        );

        // 3. Panggil seeder kategori, posts, & admin
        $this->call([
            AdminSeeder::class,
            CategorySeeder::class,
            PostSeeder::class,
        ]);
    }
}
