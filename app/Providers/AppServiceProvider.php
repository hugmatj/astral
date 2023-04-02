<?php

namespace App\Providers;

use Astral\Lib\Sponsorship;
use Astral\Lib\StarsJanitor;
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
            return new StarsJanitor(auth()->user());
        });
        $this->app->bind(Sponsorship::class, function () {
            return new Sponsorship(auth()->user());
        });
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
    }
}
