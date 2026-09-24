<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | This API is only ever called server-to-server, by the Next.js BFF
    | (frontend/lib/api.ts) — no browser page is expected to call it
    | directly, and Authorization tokens are never handed to the browser.
    | The framework default (`allowed_origins => ['*']`) would let any
    | third-party site script cross-origin requests against the public
    | endpoints (e.g. flooding /api/appointments) straight from a visitor's
    | browser, so this is pinned down to the site's own origin instead.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_filter([env('FRONTEND_URL')]),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
