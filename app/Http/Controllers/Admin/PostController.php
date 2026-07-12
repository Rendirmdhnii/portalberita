<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller {
    public function index() {
        return Inertia::render('Admin/Posts/Index', ['posts' => Post::latest()->get()]);
    }
    public function create() {
        return Inertia::render('Admin/Posts/Create', ['categories' => Category::all()]);
    }
    public function store(Request $request) {
        $request->validate([
            'title' => 'required|string|min:5|max:255',
            'category' => 'required',
            'content' => 'required',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', // Batas 2MB agar server stabil
        ], [
            'title.required' => 'Judul berita wajib diisi.',
            'title.string' => 'Judul berita harus berupa teks.',
            'title.min' => 'Judul berita minimal 5 karakter.',
            'title.max' => 'Judul tidak boleh lebih dari 255 karakter.',
            'category.required' => 'Rubrik/Kategori wajib dipilih.',
            'content.required' => 'Isi berita tidak boleh kosong.',
            'image.image' => 'File harus berupa gambar.',
            'image.mimes' => 'Format gambar harus jpeg, png, jpg, atau webp.',
            'image.max' => 'Ukuran gambar maksimal 2MB.',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            // Simpan dengan nama unik agar tidak bentrok
            $imagePath = $request->file('image')->store('posts', 'public');
        }

        Post::create([
            'title' => $request->title,
            'slug' => Str::slug($request->title) . '-' . time(),
            'category' => $request->category,
            'content' => $request->content,
            'image' => $imagePath,
            'author' => auth()->user()->name ?? 'Admin Utama',
            'status' => 'Published'
        ]);

        return redirect()->route('admin.posts.index')->with('message', 'Berita berhasil diterbitkan.');
    }
    public function edit(Post $post) {
        return Inertia::render('Admin/Posts/Edit', ['post' => $post, 'categories' => Category::all()]);
    }
    public function update(Request $request, Post $post) {
        $request->validate([
            'title' => 'required|string|min:5|max:255',
            'category' => 'required',
            'content' => 'required',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ], [
            'title.required' => 'Judul berita wajib diisi.',
            'title.string' => 'Judul berita harus berupa teks.',
            'title.min' => 'Judul berita minimal 5 karakter.',
            'title.max' => 'Judul tidak boleh lebih dari 255 karakter.',
            'category.required' => 'Rubrik/Kategori wajib dipilih.',
            'content.required' => 'Isi berita tidak boleh kosong.',
            'image.image' => 'File harus berupa gambar.',
            'image.mimes' => 'Format gambar harus jpeg, png, jpg, atau webp.',
            'image.max' => 'Ukuran gambar maksimal 2MB.',
        ]);

        $imagePath = $post->image; // keep existing image by default
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($post->image && Storage::disk('public')->exists($post->image)) {
                Storage::disk('public')->delete($post->image);
            }
            $imagePath = $request->file('image')->store('posts', 'public');
        }

        $post->update([
            'title' => $request->title,
            'category' => $request->category,
            'content' => $request->content,
            'image' => $imagePath,
            'status' => $request->status ?? $post->status,
        ]);
        return redirect()->route('admin.posts.index')->with('message', 'Perubahan telah disimpan.');
    }
    public function destroy($id) {
        if (auth()->user()->role !== 'admin' && auth()->user()->role !== 'super_admin' && auth()->user()->role !== 'superadmin') {
            abort(403, 'Aksi tidak diizinkan. Hanya Admin yang dapat menghapus berita.');
        }

        $post = Post::findOrFail($id);

        if ($post->image && Storage::disk('public')->exists($post->image)) {
            Storage::disk('public')->delete($post->image);
        }

        $post->delete();

        return redirect()->back()->with('message', 'Data berhasil dihapus.');
    }
}
