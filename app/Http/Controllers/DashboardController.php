<?php

namespace App\Http\Controllers;

use App\Lib\Abilities;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
