<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Expired admin tokens are already rejected by Sanctum on every request
// (config/sanctum.php's `expiration`, and AuthController revokes the
// admin's older tokens on each login too); this just keeps the
// personal_access_tokens table from growing forever. NOTE: nothing in this
// image currently invokes `schedule:run` on a cron — this task is defined
// but inert until that's wired up (e.g. a cron entry calling
// `php artisan schedule:run` every minute, or `php artisan schedule:work`
// as a long-running process). Harmless either way: it's cleanup, not a
// security control on its own.
Schedule::command('sanctum:prune-expired --hours=24')->daily();
