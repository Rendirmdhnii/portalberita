<?php
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Admin\PostController;
use App\Http\Controllers\Public\PageController;

// PUBLIC ROUTES
Route::get('/', function () {
    $posts = \App\Models\Post::where('status', 'Published')->latest()->get();
    $videos = \App\Models\Video::latest()->take(4)->get();
    $headlines = \App\Models\Post::where('status', 'Published')->latest()->take(5)->get();
    return Inertia::render('Public/Home', [
        'posts' => $posts,
        'trending_tags' => \App\Models\Category::where('status', 'Aktif')->take(3)->get(),
        'videos' => $videos,
        'headlines' => $headlines,
    ]);
})->name('home');

// Route Halaman Kategori Publik
Route::get('/kategori/{slug}', function ($slug) {
    $category = \App\Models\Category::where('slug', $slug)->firstOrFail();
    $posts = \App\Models\Post::where('category', $category->name)
                ->where('status', 'Published')
                ->latest()
                ->get();

    return Inertia::render('Public/Category', [
        'category' => $category,
        'posts' => $posts,
    ]);
})->name('category.show');

// Route Halaman Detail Berita Publik
Route::get('/berita/{slug}', [\App\Http\Controllers\PublicArticleController::class, 'show'])->name('berita.show');

// Route Halaman Statis Publik
Route::get('/tentang-kami', [PageController::class, 'about'])->name('tentang-kami');
Route::get('/pedoman-media', [PageController::class, 'pedoman'])->name('pedoman-media');
Route::get('/kebijakan-privasi', [PageController::class, 'privacy'])->name('kebijakan-privasi');
Route::get('/ketentuan-layanan', [PageController::class, 'terms'])->name('ketentuan-layanan');
Route::get('/struktur-redaksi', [PageController::class, 'redaksi'])->name('struktur-redaksi');


// GUEST ROUTES (Hanya bisa diakses jika BELUM login)
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
});

// PROTECTED ROUTES (Hanya bisa diakses jika SUDAH login)
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    Route::get('/admin/dashboard', function () {
        $totalViews = \App\Models\Post::sum('views') ?? 0;
        $totalBerita = \App\Models\Post::where('status', 'Published')->count();
        $totalDraft = \App\Models\Post::where('status', '!=', 'Published')->count();
        $totalVideo = \App\Models\Video::count();
        $totalKategori = \App\Models\Category::count();
        $totalIklan = \App\Models\Ad::where(function($q) {
            $q->whereNull('tanggal_berakhir')
              ->orWhere('tanggal_berakhir', '>=', \Carbon\Carbon::today());
        })->count();

        $beritaPopuler = \App\Models\Post::orderBy('views', 'desc')->take(5)->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => compact('totalViews', 'totalBerita', 'totalDraft', 'totalVideo', 'totalKategori', 'totalIklan'),
            'beritaPopuler' => $beritaPopuler
        ]);
    })->name('admin.dashboard');

    Route::resource('/admin/posts', PostController::class, ['as' => 'admin']);

    Route::resource('/admin/ads', \App\Http\Controllers\Admin\AdController::class, ['as' => 'admin']);

    Route::resource('/admin/categories', \App\Http\Controllers\Admin\CategoryController::class, ['as' => 'admin']);

    Route::resource('/admin/videos', \App\Http\Controllers\Admin\VideoController::class, ['as' => 'admin']);
});
