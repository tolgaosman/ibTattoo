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
            'process' => ['required', 'array', 'min:1', 'max:12'],
            'process.*.no' => ['required', 'string', 'max:10'],
            'process.*.title' => ['required', 'string', 'max:100'],
            'process.*.text' => ['required', 'string', 'max:2000'],
        ];
    }
}
