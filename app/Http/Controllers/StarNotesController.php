<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class StarNotesController extends Controller
{
    public function __invoke(Request $request)
    {
        $request->validate([
            'repoId' => 'required|numeric',
            'notes' => 'present|nullable|json'
        ]);

        auth()->user()->stars()->updateOrCreate(['repo_id' => $request->input('repoId')], ['notes' => $request->input('notes')]);

        return redirect()->route('dashboard.index');
    }
}
