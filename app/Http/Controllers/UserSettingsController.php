<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\User;

class UserSettingsController extends Controller
{
    public function update(Request $request)
    {
        $request->validate([
            'key' => ['required', Rule::in(User::AVAILABLE_SETTINGS)],
            'enabled' => 'required|boolean'
        ]);

        auth()->user()->writeSetting($request->input('key'), (bool)$request->input('enabled'));

        return redirect()->route('dashboard.index');
    }
}
