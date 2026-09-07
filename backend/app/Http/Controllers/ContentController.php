<?php

namespace App\Http\Controllers;

use App\Http\Resources\ContentResource;
use App\Models\Setting;
use App\Models\Tattoo;

class ContentController extends Controller
{
    /**
     * Everything the homepage needs in a single call — mirrors
     * frontend/lib/db.ts's SiteContent shape.
     */
    public function __invoke(): ContentResource
    {
        // Insertion order, oldest first — matches the original content.json
        // array where new items were simply pushed onto the end.
        $gallery = Tattoo::query()->orderBy('id')->get();

        return new ContentResource([
            'hero' => Setting::getValue('hero', [
                'title' => 'Irmak Bozkurt - tatt2me',
                'tagline' => 'iğne nereye giderse gitsin, kalbim hep Lefke\'de kalır',
                'specialities' => ['İnce çizgi', 'Neo-traditional', 'Geometrik nokta', 'Lefke, KKTC'],
            ]),
            'about' => Setting::getValue('about', []),
            'aboutImage' => Setting::getValue('about_image', '/images/hakkimda/portre.jpg'),
            'process' => Setting::getValue('process', []),
            'gallery' => $gallery,
            'boardSelection' => Setting::getValue('board_selection', []),
            'contact' => Setting::getValue('contact', []),
        ]);
    }
}
