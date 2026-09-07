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
        return [
            'hero' => $this->resource['hero'],
            'about' => $this->resource['about'],
            'aboutImage' => $this->resource['aboutImage'],
            'process' => $this->resource['process'],
            'gallery' => TattooResource::collection($this->resource['gallery']),
            'boardSelection' => $this->resource['boardSelection'],
            'contact' => $this->resource['contact'],
        ];
    }
}
