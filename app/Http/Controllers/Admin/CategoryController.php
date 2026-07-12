<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class CategoryController extends Controller {
    public function index() {
        return Inertia::render('Admin/Categories/Index', ['categories' => Category::latest()->get()]);
    }
    public function store(Request $request) {
        $request->validate(['name' => 'required']);
        Category::create(['name' => $request->name, 'slug' => Str::slug($request->name)]);
        return redirect()->route('admin.categories.index');
    }
    public function destroy(Category $category) {
        $category->delete();
        return redirect()->route('admin.categories.index');
    }
}
