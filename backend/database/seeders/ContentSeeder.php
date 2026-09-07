<?php

namespace Database\Seeders;

use App\Models\Setting;
use App\Models\Tattoo;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class ContentSeeder extends Seeder
{
    /**
     * Import the site's original content.json + work photos so nothing from
     * the old file-based store (frontend/lib/db.ts) is lost.
     */
    public function run(): void
    {
        $contentPath = base_path('../frontend/data/content.json');

        if (! File::exists($contentPath)) {
            $this->command?->warn("content.json not found at {$contentPath}, skipping content import.");

            return;
        }

        $content = json_decode(File::get($contentPath), true);

        Setting::putValue('about', $content['about'] ?? []);
        Setting::putValue('process', $content['process'] ?? []);
        Setting::putValue('contact', $content['contact'] ?? []);

        $frontendPublicPath = base_path('../frontend/public');
        $boardSelection = [];

        foreach ($content['gallery'] ?? [] as $index => $item) {
            $imagePath = $this->importImage($frontendPublicPath, $item['image']);

            Tattoo::query()->updateOrCreate(
                ['public_id' => $item['id']],
                [
                    'slug' => $item['slug'],
                    'title' => $item['title'],
                    'style' => $item['style'],
                    'size' => $item['size'],
                    'tattoo_date' => $item['date'],
                    'placement' => $item['placement'],
                    'duration' => $item['duration'],
                    'story' => $item['story'],
                    'aspect' => $item['aspect'],
                    'image_path' => $imagePath,
                    'credit' => $item['credit'],
                    'sort_order' => $index,
                ],
            );

            // Original site featured every seeded piece on the board by default.
            $boardSelection[] = $item['id'];
        }

        Setting::putValue('board_selection', array_slice($content['boardSelection'] ?? $boardSelection, 0, 9));
    }

    private function importImage(string $frontendPublicPath, string $publicRelativePath): string
    {
        $source = $frontendPublicPath.str_replace('/', DIRECTORY_SEPARATOR, $publicRelativePath);
        $filename = basename($publicRelativePath);
        $destination = 'tattoos/'.$filename;

        if (File::exists($source) && ! Storage::disk('public')->exists($destination)) {
            Storage::disk('public')->put($destination, File::get($source));
        }

        return $destination;
    }
}
