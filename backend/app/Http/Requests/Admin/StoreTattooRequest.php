<?php

namespace App\Http\Requests\Admin;

use App\Enums\TattooAspect;
use App\Enums\TattooSize;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTattooRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Frontend generates this client-side (Date.now().toString()) —
            // see GalleryManager.tsx — and it becomes the public_id.
            'id' => ['required', 'string', 'max:64', 'unique:tattoos,public_id'],
            'slug' => ['required', 'string', 'max:255', 'unique:tattoos,slug'],
            'title' => ['required', 'string', 'max:255'],
            'style' => ['required', 'string', 'max:255'],
            'size' => ['required', Rule::enum(TattooSize::class)],
            'date' => ['required', 'date'],
            'placement' => ['required', 'string', 'max:255'],
            'duration' => ['nullable', 'string', 'max:255'],
            'story' => ['nullable', 'string', 'max:5000'],
            'aspect' => ['required', Rule::enum(TattooAspect::class)],
            // Rendered as an <img src>, but still pinned to what this app
            // actually produces (an uploaded /storage path or a site-local
            // /images path) or a remote https image, to keep out
            // `javascript:`/`data:` values and protocol-relative `//host`
            // URLs (which a browser resolves to an arbitrary external host).
            'image' => ['required', 'string', 'max:2048', 'regex:#^(https://|/(?!/))#'],
            'credit' => ['required', 'string', 'max:255'],
        ];
    }
}
