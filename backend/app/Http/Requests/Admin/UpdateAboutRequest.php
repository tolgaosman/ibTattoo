<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAboutRequest extends FormRequest
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
            'about' => ['required', 'array', 'min:1'],
            'about.*' => ['required', 'string'],
            'aboutImage' => ['sometimes', 'string'],
        ];
    }
}
