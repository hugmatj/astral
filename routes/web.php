<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CleanupController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\StarsController;
use App\Http\Controllers\StarTagsController;
use App\Http\Controllers\StarNotesController;
use App\Http\Controllers\TagsController;
use App\Http\Controllers\TagsSortOrderController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserSettingsController;
use App\Http\Controllers\WebWorkerProxyController;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

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
    Route::put('tags/{tag}', [TagsController::class, 'update'])->name('tags.update');

    Route::post('stars/tag', [StarTagsController::class, 'store'])->name('star.tags.store');
    Route::put('star/sync-tags', [StarTagsController::class, 'update'])->name('star.tags.update');
    Route::put('star/notes', StarNotesController::class)->name('star.notes.update');
    Route::delete('star/{star}', [StarsController::class, 'destroy'])->name('star.destroy');

    Route::get('check-sponsorship', [CleanupController::class, 'index'])->name('sponsor.check');

    Route::put('settings', [UserSettingsController::class, 'update'])->name('settings.update');

    Route::post('/revoke-grant', [UserController::class, 'revokeGrant'])->name('revoke-grant');
    Route::delete('/user', [UserController::class, 'destroy'])->name('user.destroy');

    Route::get('logout', [AuthController::class, 'logout'])->name('logout');
});
