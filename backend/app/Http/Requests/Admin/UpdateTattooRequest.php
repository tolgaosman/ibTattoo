<?php

namespace App\Http\Requests\Admin;

use App\Enums\TattooAspect;
use App\Enums\TattooSize;
use App\Enums\TattooStyle;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTattooRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Partial update (updateTattooAction sends Partial<Tattoo>) — every
     * field is optional but validated when present.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $tattoo = $this->route('tattoo');

        return [
            'slug' => ['sometimes', 'string', 'max:255', Rule::unique('tattoos', 'slug')->ignore($tattoo?->id)],
            'title' => ['sometimes', 'string', 'max:255'],
            'style' => ['sometimes', Rule::enum(TattooStyle::class)],
            'size' => ['sometimes', Rule::enum(TattooSize::class)],
            'date' => ['sometimes', 'date'],
            'placement' => ['sometimes', 'string', 'max:255'],
            'duration' => ['sometimes', 'string', 'max:255'],
            'story' => ['sometimes', 'string'],
            'aspect' => ['sometimes', Rule::enum(TattooAspect::class)],
            'image' => ['sometimes', 'string'],
            'credit' => ['sometimes', 'string', 'max:255'],
        ];
    }
}
