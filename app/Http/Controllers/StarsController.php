<?php

namespace App\Http\Controllers;

use App\Models\Star;
use Illuminate\Http\Request;

class StarsController extends Controller
{
    public function destroy(Star $star)
    {
        $star->delete();

        return redirect()->route('dashboard.index');
    }
}
