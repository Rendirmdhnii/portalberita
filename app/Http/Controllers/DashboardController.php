<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Redirect ke halaman dashboard spesifik berdasarkan role.
     */
    public function index(Request $request)
    {
        $role = $request->user()->role;

        switch ($role) {
            case 'super_admin':
                return redirect()->route('superadmin.dashboard');
            case 'admin':
                return redirect()->route('admin.dashboard');
            case 'author':
                return redirect()->route('author.dashboard');
            case 'subscriber':
            case 'guest':
            default:
                return redirect()->route('reader.dashboard');
        }
    }
}
