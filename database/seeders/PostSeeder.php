<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Post;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        $posts = [
            [
                'title' => 'Pemerintah Resmikan Pembangunan Infrastruktur Baru di Ibu Kota Nusantara',
                'slug' => 'pemerintah-resmikan-pembangunan-infrastruktur-baru-di-ibu-kota-nusantara',
                'category' => 'Politik',
                'author' => 'Super Admin',
                'status' => 'Published',
            ],
            [
                'title' => 'IHSG Ditutup Menguat Seiring Masuknya Aliran Modal Asing',
                'slug' => 'ihsg-ditutup-menguat-seiring-masuknya-aliran-modal-asing',
                'category' => 'Ekonomi',
                'author' => 'Super Admin',
                'status' => 'Published',
            ],
            [
                'title' => 'Timnas Indonesia Siap Hadapi Laga Penentu di Kualifikasi Piala Dunia',
                'slug' => 'timnas-indonesia-siap-hadapi-laga-penentu-di-kualifikasi-piala-dunia',
                'category' => 'Olahraga',
                'author' => 'Super Admin',
                'status' => 'Published',
            ],
        ];

        foreach ($posts as $post) {
            Post::create($post);
        }
    }
}
