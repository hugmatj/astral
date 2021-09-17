<?php

use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WebWorkerProxyController;

$workerPath = 'js/workers/githubStars.worker.ts';
$jsPath = config('vite.aliases')['@'];

// Fetch the contents of the worker file
$workerContents = Cache::rememberForever('web-worker', function () use ($workerPath) {
    return File::get(resource_path($workerPath));
});

// Match all the local import paths
preg_match_all("#import .+ from '(?<path>@/\w+)'#", $workerContents, $importMatches);

// Replace the import paths with their actual resource path
$imports = collect($importMatches['path'])->map(function ($path) use ($jsPath) {
    if (!Str::endsWith($path, ".ts")) {
        $path = $path."/index.ts";
    }

    return Str::replaceFirst('@', $jsPath, $path);
});

$imports->prepend(Str::replaceFirst('js', $jsPath, $workerPath));

// Add a route that acts as a proxy for the Web Worker, and each of its local imports
$imports->each(fn ($path) => Route::get($path, WebWorkerProxyController::class));
