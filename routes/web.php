<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TagsController;
use App\Http\Controllers\StarTagsController;
use Illuminate\Routing\RouteUrlGenerator;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('auth/github', [AuthController::class, 'redirectToProvider'])->name('github.auth');
Route::get('auth/github/callback', [AuthController::class, 'handleProviderCallback'])->name('github.callback');

Route::group(['middleware' => 'auth'], function () {
    Route::get('/', function () {
        return Inertia::render('Dashboard', [
            'tags' => auth()->user()->tags,
        ]);
    })->name('dashboard.index');

    Route::post('tags', [TagsController::class, 'store'])->name('tags.store');
    Route::delete('tags/{tag}', [TagsController::class, 'destroy'])->name('tags.destroy');

    Route::post('stars/tag', [StarTagsController::class, 'store'])->name('star.tags.store');
});

