<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProcessRequest extends FormRequest
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
            'process' => ['required', 'array'],
            'process.tr' => ['required', 'array', 'min:1'],
            'process.tr.*.no' => ['required', 'string'],
            'process.tr.*.title' => ['required', 'string'],
            'process.tr.*.text' => ['required', 'string'],
            'process.en' => ['nullable', 'array'],
            'process.en.*.no' => ['required', 'string'],
            'process.en.*.title' => ['required', 'string'],
            'process.en.*.text' => ['required', 'string'],
        ];
    }
}
