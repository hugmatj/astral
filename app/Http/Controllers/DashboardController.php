<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Lib\Abilities;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard', [
            'limits' => config('limits'),
            'abilities' => [
                Abilities::CREATE_TAG => auth()->user()->can('tags.create'),
            ],
            'tags' => auth()->user()->tags()->withStarCount()->get(),
            'stars' => auth()->user()->stars()->with('tags')->get(),
        ]);
    }
}
