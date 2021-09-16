<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class WebWorkerProxyController extends Controller
{
    public function __invoke(Request $request)
    {
        $BASE_URL = config('vite.dev_url');
        $path = $request->path();
        $fgcContext = stream_context_create([
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
            ],
        ]);

        return response(file_get_contents($BASE_URL.'/'.$path, false, $fgcContext), 200, ['Content-Type' => 'application/javascript']);
    }
}
