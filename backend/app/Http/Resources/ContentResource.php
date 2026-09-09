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
        return [
            'hero' => $this['hero'],
            'about' => $this['about'],
            'aboutImage' => $this['aboutImage'],
            'process' => $this['process'],
            'gallery' => TattooResource::collection($this['gallery']),
            'boardSelection' => $this['boardSelection'],
            'contact' => $this['contact'],
        ];
    }
}
