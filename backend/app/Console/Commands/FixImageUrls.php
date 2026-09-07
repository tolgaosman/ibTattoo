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

            // Already a relative /api/storage path — nothing to do
            if (!str_contains($url, '://')) {
                continue;
            }

            // Extract the filename from whatever absolute URL was stored
            // e.g. http://127.0.0.1:8000/storage/tattoos/foo.jpg  -> tattoos/foo.jpg
            $path = preg_replace('#^.*?/storage/#', '', $url);
            $newUrl = '/api/storage/' . $path;

            DB::table('tattoos')->where('id', $tattoo->id)->update(['image_path' => $newUrl]);
            $this->line("Tattoo fixed: {$url}  =>  {$newUrl}");
            $fixed++;
        }

        // Fix about_image in settings
        $setting = DB::table('settings')->where('key', 'about_image')->first();
        if ($setting && str_contains($setting->value, '://')) {
            $path   = preg_replace('#^.*?/storage/#', '', $setting->value);
            $newUrl = '/api/storage/' . $path;
            DB::table('settings')->where('key', 'about_image')->update(['value' => $newUrl]);
            $this->line("About image fixed: {$setting->value}  =>  {$newUrl}");
            $fixed++;
        }

        $this->info("Done. {$fixed} URL(s) fixed.");
    }
}
