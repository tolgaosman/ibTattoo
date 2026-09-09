<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Mirrors the frontend's SiteContent interface (frontend/lib/db.ts).
 *
 * Expects an associative array: about, process, gallery (a Tattoo
 * collection), boardSelection, contact.
 */
class ContentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $isAdmin = $request->query('admin') === '1';
        $locale = app()->getLocale();

        // Helper to extract the localized value for settings
        // If it's admin, return the full translations object
        // If it's a visitor, try to get the current locale's value, fallback to 'tr' or the raw value itself if it's not localized yet
        $getLocalized = function ($value) use ($isAdmin, $locale) {
            if ($isAdmin) return $value;
            
            // If the value is an array and has a 'tr' or 'en' key, it's a localized field
            if (is_array($value) && (isset($value['tr']) || isset($value['en']))) {
                return $value[$locale] ?? $value['tr'] ?? '';
            }
            
            return $value;
        };

        return [
            'hero' => $getLocalized($this->resource['hero']),
            'about' => $getLocalized($this->resource['about']),
            'aboutImage' => $this->resource['aboutImage'],
            'process' => $getLocalized($this->resource['process']),
            'gallery' => TattooResource::collection($this->resource['gallery']),
            'boardSelection' => $this->resource['boardSelection'],
            'contact' => $this->resource['contact'],
        ];
    }
}
