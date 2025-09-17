<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\MenuRepositoryInterface;
use App\Repositories\MenuRepository;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            MenuRepositoryInterface::class,
            MenuRepository::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
