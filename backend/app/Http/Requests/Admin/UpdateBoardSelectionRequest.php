<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBoardSelectionRequest extends FormRequest
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
            // Mirrors the admin UI's fixed 3x3 board (frontend/components/admin/DashboardForms.tsx).
            'boardSelection' => ['required', 'array', 'size:9'],
            'boardSelection.*' => ['required', 'string', 'distinct', 'exists:tattoos,public_id'],
        ];
    }
}
