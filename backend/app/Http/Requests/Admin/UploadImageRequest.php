<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UploadImageRequest extends FormRequest
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
        // Two accepted shapes: a multipart `file`, or a base64 `data` payload
        // with its `filename` (what the Next.js server action sends). Exactly
        // one of them must be present — an empty request used to validate.
        return [
            'file' => ['required_without:data', 'nullable', 'image', 'max:8192'],
            'data' => ['required_without:file', 'nullable', 'string'],
            'filename' => ['required_with:data', 'nullable', 'string', 'max:255'],
        ];
    }
}
