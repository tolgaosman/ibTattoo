<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class FixImageUrls extends Command
{
    protected $signature = 'fix:image-urls';
    protected $description = 'Fix broken image URLs stored as absolute localhost addresses';

    public function handle(): void
    {
        // Fix tattoo image_path column
        $tattoos = DB::table('tattoos')->get();
        $fixed = 0;

        foreach ($tattoos as $tattoo) {
            $url = $tattoo->image_path;

            // Already a correct relative /storage path — nothing to do
            if (! str_contains($url, '://') && ! str_starts_with($url, '/api/storage/')) {
                continue;
            }

            // Extract the path from whatever was stored, absolute or /api/-prefixed
            // e.g. http://127.0.0.1:8000/storage/tattoos/foo.jpg -> tattoos/foo.jpg
            //      /api/storage/tattoos/foo.jpg                  -> tattoos/foo.jpg
            $path = preg_replace('#^.*?/storage/#', '', $url);
            $newUrl = '/storage/' . $path;

            DB::table('tattoos')->where('id', $tattoo->id)->update(['image_path' => $newUrl]);
            $this->line("Tattoo fixed: {$url}  =>  {$newUrl}");
            $fixed++;
        }

        // Fix about_image in settings
        // `settings.value` is a JSON column (Setting casts it to `array`), so it
        // must be decoded and re-encoded — writing a bare string here corrupts it.
        $setting = DB::table('settings')->where('key', 'about_image')->first();
        $current = $setting ? json_decode($setting->value, true) : null;

        if (is_string($current) && (str_contains($current, '://') || str_starts_with($current, '/api/storage/'))) {
            $newUrl = '/storage/' . preg_replace('#^.*?/storage/#', '', $current);
            DB::table('settings')->where('key', 'about_image')->update(['value' => json_encode($newUrl)]);
            $this->line("About image fixed: {$current}  =>  {$newUrl}");
            $fixed++;
        }

        $this->info("Done. {$fixed} URL(s) fixed.");
    }
}
