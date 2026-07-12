<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicArticleController extends Controller
{
    /**
     * Tampilkan detail artikel berdasarkan slug.
     */
    public function show($slug)
    {
        $post = Post::where('slug', $slug)
            ->where(function($q) {
                $q->where('status', 'Published')->orWhere('status', 'published');
            })
            ->firstOrFail();

        $post->increment('views');

        return Inertia::render('Public/Article', [
            'post' => $post
        ]);
    }
}
