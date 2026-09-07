<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateContactRequest extends FormRequest
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
            'email' => ['required', 'email'],
            'phone' => ['required', 'string'],
            'phoneDisplay' => ['required', 'string'],
            'instagram' => ['required', 'string'],
            'instagramUrl' => ['required', 'url'],
        ];
    }
}
