<?php

namespace App\Providers;

use Astral\Lib\Sponsorship;
use Astral\Lib\StarsJanitor;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(StarsJanitor::class, function () {
            return new StarsJanitor();
        });
        $this->app->bind(Sponsorship::class, function () {
            return new Sponsorship();
        });
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Inertia::share('flash', function () {
            return [
                'sponsorship_required' => session('sponsorship_required'),
            ];
        });
    }
}
