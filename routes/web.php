<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CleanupController;
use App\Http\Controllers\TagsController;
use App\Http\Controllers\TagsSortOrderController;
use App\Http\Controllers\StarTagsController;
use App\Http\Controllers\DashboardController;

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
Route::get('auth', [AuthController::class, 'index'])->name('auth');
Route::get('auth/github', [AuthController::class, 'redirectToProvider'])->name('github.auth');
Route::get('auth/github/callback', [AuthController::class, 'handleProviderCallback'])->name('github.callback');

Route::redirect('/login', '/auth/github')->name('login');

Route::group(['middleware' => 'auth'], function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard.index');

    Route::post('tags', [TagsController::class, 'store'])->name('tags.store');
    Route::delete('tags/{tag}', [TagsController::class, 'destroy'])->name('tags.destroy');
    Route::put('tags/reorder', TagsSortOrderController::class)->name('tags.reorder');

    Route::post('stars/tag', [StarTagsController::class, 'store'])->name('star.tags.store');

    Route::get('check-sponsorship', [CleanupController::class, 'index'])->name('sponsor.check');

    Route::get('logout', [AuthController::class, 'logout'])->name('logout');
});

