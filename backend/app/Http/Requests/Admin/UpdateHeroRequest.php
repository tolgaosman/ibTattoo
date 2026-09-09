<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateHeroRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'array'],
            'title.tr' => ['required', 'string', 'max:255'],
            'title.en' => ['nullable', 'string', 'max:255'],
            'tagline' => ['required', 'array'],
            'tagline.tr' => ['required', 'string', 'max:500'],
            'tagline.en' => ['nullable', 'string', 'max:500'],
            'specialities' => ['required', 'array'],
            'specialities.tr' => ['required', 'array'],
            'specialities.tr.*' => ['required', 'string', 'max:100'],
            'specialities.en' => ['nullable', 'array'],
            'specialities.en.*' => ['required', 'string', 'max:100'],
        ];
    }
}
