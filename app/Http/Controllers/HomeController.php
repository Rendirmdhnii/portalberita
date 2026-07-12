<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Tampilkan halaman depan dengan data dinamis.
     */
    public function index()
    {
        // 1. Ambil 5 berita terbaru untuk Headline (Slider/Grid utama)
        $headlines = Post::with(['author', 'category'])
            ->where('status', 'published')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // Ambil ID dari headlines agar tidak duplikat di latest_posts
        $headlineIds = $headlines->pluck('id');

        // 2. Ambil sisa berita terbaru (Pagination)
        $latestPosts = Post::with(['author', 'category'])
            ->where('status', 'published')
            ->whereNotIn('id', $headlineIds)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        // 3. Ambil daftar kategori untuk navigasi Navbar
        $categories = Category::orderBy('name', 'asc')->get();

        return Inertia::render('Public/Home', [
            'headlines' => $headlines,
            'latest_posts' => $latestPosts,
            'categories' => $categories,
        ]);
    }
}
