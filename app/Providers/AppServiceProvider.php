<?php

namespace App\Providers;

use Inertia\Inertia;
use Astral\Lib\StarsJanitor;
use Astral\Lib\Sponsorship;
use Illuminate\Support\ServiceProvider;

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
