<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ad;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class AdController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Ads/Index', ['ads' => Ad::all()]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'position' => 'required',
            'image' => 'required|image|mimes:jpg,jpeg,png,gif,webp|max:2048',
            'tanggal_berakhir' => 'nullable|date',
        ]);

        $imagePath = $request->file('image')->store('ads', 'public');

        Ad::create([
            'name' => $request->name,
            'position' => $request->position,
            'image' => $imagePath,
            'link' => $request->link,
            'tanggal_berakhir' => $request->tanggal_berakhir,
            'is_active' => true,
        ]);

        return back()->with('message', 'Iklan berhasil ditambahkan!');
    }

    public function destroy(Ad $ad)
    {
        Storage::disk('public')->delete($ad->image);
        $ad->delete();
        return back()->with('message', 'Iklan berhasil dihapus!');
    }

    // Placeholder methods required by resource route
    public function create() {}
    public function show(Ad $ad) {}
    public function edit(Ad $ad) {}
    public function update(Request $request, Ad $ad) {}
}
