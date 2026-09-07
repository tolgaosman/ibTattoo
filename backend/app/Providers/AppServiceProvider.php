<?php

namespace App\Providers;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // The frontend expects flat JSON matching its TS interfaces directly
        // (SiteContent, Tattoo, ...) — no {"data": ...} envelope.
        JsonResource::withoutWrapping();
    }
}
