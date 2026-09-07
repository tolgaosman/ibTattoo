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
            'duration' => ['required', 'string', 'max:255'],
            'story' => ['required', 'string'],
            'aspect' => ['required', Rule::enum(TattooAspect::class)],
            'image' => ['required', 'string'],
            'credit' => ['required', 'string', 'max:255'],
        ];
    }
}
