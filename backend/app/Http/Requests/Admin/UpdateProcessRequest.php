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
            'process' => ['required', 'array', 'min:1'],
            'process.*.no' => ['required', 'string'],
            'process.*.title' => ['required', 'string'],
            'process.*.text' => ['required', 'string'],
        ];
    }
}
