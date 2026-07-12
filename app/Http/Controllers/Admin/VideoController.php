<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VideoController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Videos/Index', [
            'videos' => Video::latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'link' => 'required|string|max:255',
        ], [
            'judul.required' => 'Judul video wajib diisi.',
            'judul.max' => 'Judul video tidak boleh lebih dari 255 karakter.',
            'link.required' => 'Link YouTube wajib diisi.',
        ]);

        // Ekstrak YouTube Video ID
        $link = $request->link;
        $youtubeId = null;

        // Pattern regex untuk berbagai format URL YouTube
        $pattern = '%(?:youtube(?:-nocookie)?\.com/(?:[^/]+/.+/|(?:v|e(?:mbed)?)/|.*[?&]v=)|youtu\.be/)([^"&?/ ]{11})%i';
        if (preg_match($pattern, $link, $match)) {
            $youtubeId = $match[1];
        }

        if (!$youtubeId) {
            return back()->withErrors(['link' => 'Link YouTube tidak valid. Pastikan URL berisi 11 karakter video ID.']);
        }

        Video::create([
            'judul' => $request->judul,
            'youtube_id' => $youtubeId,
        ]);

        return back()->with('message', 'Video Pojok Video berhasil ditambahkan!');
    }

    public function destroy($id)
    {
        $video = Video::findOrFail($id);
        $video->delete();

        return back()->with('message', 'Video berhasil dihapus.');
    }
}
