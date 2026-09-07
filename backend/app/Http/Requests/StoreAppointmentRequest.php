<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Mirrors frontend/app/api/randevu/route.ts's AppointmentPayload.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'contact' => ['required', 'string', 'max:255'],
            'idea' => ['required', 'string'],
            'placement' => ['required', 'string', 'max:255'],
            'size' => ['required', 'string', 'max:255'],
            'reference' => ['nullable', 'string'],
            'dates' => ['nullable', 'string', 'max:255'],
        ];
    }
}
