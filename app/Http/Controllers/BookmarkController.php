<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookmarkController extends Controller
{
    /**
     * Tampilkan daftar bookmark milik user yang sedang login.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $bookmarks = $user->bookmarks()
            ->with(['author', 'category'])
            ->orderBy('post_user.created_at', 'desc')
            ->paginate(12);

        return Inertia::render('Dashboard/Reader/Index', [
            'bookmarks' => $bookmarks
        ]);
    }

    /**
     * Toggle status bookmark (Simpan / Hapus dari daftar bacaan).
     */
    public function toggle(Request $request, Post $post)
    {
        $user = $request->user();

        // Fitur toggle dari Eloquent secara otomatis akan menambahkan 
        // jika belum ada, dan menghapus jika sudah ada.
        $user->bookmarks()->toggle($post->id);

        return back()->with('success', 'Status bookmark berhasil diperbarui.');
    }
}
