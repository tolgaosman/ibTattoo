<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Pure JSON API — never redirect unauthenticated requests to a
        // "login" web route (there isn't one).
        $middleware->redirectGuestsTo(fn () => null);

        // Every request PHP-FPM ever sees arrives from inside the compose
        // network (nginx's `web` service, proxying either the browser
        // directly or the Next.js `frontend` container calling back into
        // /api) — the backend container is never published to the host or
        // the internet. Trusting X-Forwarded-* from that whole private range
        // is what lets `$request->ip()` (throttle:5,1 on /appointments and
        // /admin/login, and the `ip` column on stored appointments) resolve
        // to the real visitor instead of the frontend container's own
        // address. nginx (docker/nginx/default.conf) resolves and overwrites
        // this header from its own real_ip config before it ever reaches
        // here, so it isn't attacker-controlled by the time it lands.
        $middleware->trustProxies(at: [
            '10.0.0.0/8',
            '172.16.0.0/12',
            '192.168.0.0/16',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
    })->create();
