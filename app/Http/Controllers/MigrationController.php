<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class MigrationController extends Controller
{
    public function index()
    {
        return Inertia::render('Migrate', [
            'stars' => auth()->user()->stars()->get(),
        ]);
    }
}
