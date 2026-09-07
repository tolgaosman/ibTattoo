<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Uploaded-image URLs were stored in two broken shapes before this migration:
 *
 *   http://127.0.0.1:8000/storage/tattoos/foo.jpg   (absolute APP_URL leaked into the DB)
 *   /api/storage/tattoos/foo.jpg                    (an "/api" prefix nginx routes to PHP-FPM,
 *                                                    where no such route exists — always 404)
 *
 * The only shape nginx actually serves is `/storage/...` (docker/nginx/default.conf,
 * `location /storage/`), so normalise everything to that. Bundled seed paths such as
 * `/images/work/foo.jpg` are left untouched.
 *
 * This runs from the container entrypoint's `migrate --force`, so the fix lands on
 * deploy without anyone having to remember an artisan command.
 */
return new class extends Migration
{
    public function up(): void
    {
        foreach (DB::table('tattoos')->select('id', 'image_path')->get() as $tattoo) {
            $normalized = $this->normalize((string) $tattoo->image_path);

            if ($normalized !== $tattoo->image_path) {
                DB::table('tattoos')->where('id', $tattoo->id)->update(['image_path' => $normalized]);
            }
        }

        // `settings.value` is a JSON column (see the Setting model's `array` cast),
        // so it has to be decoded and re-encoded rather than written as a bare string.
        $setting = DB::table('settings')->where('key', 'about_image')->first();

        if ($setting) {
            $current = json_decode($setting->value, true);

            if (is_string($current)) {
                $normalized = $this->normalize($current);

                if ($normalized !== $current) {
                    DB::table('settings')
                        ->where('key', 'about_image')
                        ->update(['value' => json_encode($normalized)]);
                }
            }
        }
    }

    public function down(): void
    {
        // Data normalisation — the previous values were broken, so there is
        // nothing worth restoring.
    }

    private function normalize(string $url): string
    {
        if (str_starts_with($url, '/api/storage/')) {
            return '/storage/'.substr($url, strlen('/api/storage/'));
        }

        if (str_contains($url, '://') && str_contains($url, '/storage/')) {
            return '/storage/'.preg_replace('#^.*?/storage/#', '', $url);
        }

        return $url;
    }
};
