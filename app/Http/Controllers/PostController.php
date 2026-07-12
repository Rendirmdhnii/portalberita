<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PostController extends Controller
{
    /**
     * Display a listing of the posts.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $query = Post::with(['author', 'category'])->orderBy('created_at', 'desc');

        // Jika role adalah author, hanya tampilkan berita miliknya sendiri
        if ($user->role === 'author') {
            $query->where('author_id', $user->id);
        }

        $posts = $query->get();

        return inertia('Dashboard/Post/Index', [
            'posts' => $posts
        ]);
    }

    /**
     * Store a newly created post in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'thumbnail' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'status' => 'required|in:draft,published,rejected',
        ]);

        // Otorisasi Status: Author hanya bisa menyimpan sebagai draft
        $status = $validated['status'];
        if ($request->user()->role === 'author') {
            $status = 'draft';
        }

        $thumbnailPath = null;
        if ($request->hasFile('thumbnail')) {
            // Upload to storage/app/public/posts
            $thumbnailPath = $request->file('thumbnail')->store('posts', 'public');
            // Ensure you run `php artisan storage:link`
        }

        Post::create([
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']) . '-' . uniqid(),
            'content' => $validated['content'],
            'category_id' => $validated['category_id'],
            'status' => $status,
            'is_premium' => $request->boolean('is_premium'),
            'thumbnail' => $thumbnailPath ? '/storage/' . $thumbnailPath : null,
            'author_id' => $request->user()->id,
        ]);

        return redirect()->route('dashboard.posts.index')->with('success', 'Berita berhasil ditambahkan.');
    }

    /**
     * Update the specified post in storage.
     */
    public function update(Request $request, Post $post)
    {
        // Pastikan author hanya bisa mengupdate miliknya sendiri
        if ($request->user()->role === 'author' && $post->author_id !== $request->user()->id) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'thumbnail' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'status' => 'required|in:draft,published,rejected',
        ]);

        // Otorisasi Status: Author paksa jadi draft
        $status = $validated['status'];
        if ($request->user()->role === 'author') {
            $status = 'draft';
        }

        $thumbnailPath = $post->getRawOriginal('thumbnail'); // get relative path if exists
        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('posts', 'public');
            $thumbnailPath = '/storage/' . $path;
        }

        $post->update([
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']) . '-' . uniqid(),
            'content' => $validated['content'],
            'category_id' => $validated['category_id'],
            'status' => $status,
            'is_premium' => $request->boolean('is_premium'),
            'thumbnail' => $thumbnailPath,
        ]);

        return redirect()->route('dashboard.posts.index')->with('success', 'Berita berhasil diperbarui.');
    }

    /**
     * Approve (Terima & Publish) berita yang statusnya draft.
     */
    public function approve($id)
    {
        $post = Post::findOrFail($id);
        $post->update(['status' => 'published']);
        
        return redirect()->back()->with('success', 'Berita berhasil dipublish!');
    }

    /**
     * Reject (Kembalikan ke Draft / Tolak) berita.
     */
    public function reject($id)
    {
        $post = Post::findOrFail($id);
        $post->update(['status' => 'draft']);
        
        return redirect()->back()->with('success', 'Berita dikembalikan ke Draft.');
    }

    /**
     * Tampilkan berita berdasarkan kategori.
     */
    public function category($slug)
    {
        return \Inertia\Inertia::render('Public/Category', ['slug' => $slug]);
    }
}
