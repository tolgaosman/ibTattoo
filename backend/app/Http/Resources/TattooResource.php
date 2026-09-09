<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/**
 * Mirrors the frontend's Tattoo interface (frontend/lib/tattoos.ts) field for
 * field, so the Next.js side can consume this response without any mapping.
 */
class TattooResource extends JsonResource
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
            'id' => $this->public_id,
            'slug' => $this->slug,
            'title' => $isAdmin ? $this->getTranslations('title') : $this->title,
            'style' => $this->style,
            'size' => $this->size->value,
            'date' => $this->tattoo_date->toDateString(),
            'placement' => $isAdmin ? $this->getTranslations('placement') : $this->placement,
            'duration' => $isAdmin ? $this->getTranslations('duration') : $this->duration,
            'story' => $isAdmin ? $this->getTranslations('story') : $this->story,
            'aspect' => $this->aspect->value,
            'image' => $this->resolveImageUrl(),
            'credit' => $this->credit,
        ];
    }

    /**
     * image_path is usually a storage-relative path (from the uploader or
     * the seeder), but the admin's manual "image URL" field also accepts an
     * absolute URL or a Next.js /public path — pass those through as-is.
     */
    private function resolveImageUrl(): string
    {
        if (str_starts_with($this->image_path, 'http://') || str_starts_with($this->image_path, 'https://') || str_starts_with($this->image_path, '/')) {
            return $this->image_path;
        }

        return Storage::disk('public')->url($this->image_path);
    }
}
