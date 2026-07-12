<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run()
    {
        $categories = [
            'Pemerintahan',
            'Politik',
            'Hukum',
            'Sosial Budaya',
            'Pendidikan',
            'Ekonomi',
            'OlahRaga',
            'Kesehatan',
            'Nasional',
            'Internasional',
            'Teknologi',
            'Otomotif',
            'Gaya Hidup',
            'Opini',
            'Cek Fakta'
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(
                ['name' => $category],
                [
                    'slug' => Str::slug($category),
                    'status' => 'Aktif'
                ]
            );
        }
    }
}
