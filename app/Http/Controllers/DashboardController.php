<?php

namespace App\Http\Controllers;

use App\Lib\Abilities;
use App\Models\Star;
use App\Models\Tag;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard', [
            'limits' => auth()->user()->limits(),
            'abilities' => [
                Abilities::CREATE_TAG => auth()->user()->can('create', Tag::class),
                Abilities::ADD_NOTES => auth()->user()->can('addNotes', Star::class),
            ],
            'tags' => auth()->user()->tags()->withStarCount()->get(),
            'stars' => auth()->user()->stars()->with('tags')->get(),
        ]);
    }
}
