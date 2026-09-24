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
            'email' => ['required', 'email', 'max:255'],
            // Used bare in `tel:+${phone}` and `wa.me/${phone}` (FloatingWhatsApp,
            // AppointmentForm) — digits only, no formatting characters.
            'phone' => ['required', 'string', 'regex:/^\d{7,15}$/'],
            'phoneDisplay' => ['required', 'string', 'max:50'],
            'instagram' => ['required', 'string', 'max:100'],
            'instagramUrl' => ['required', 'url:https', 'max:255'],
        ];
    }
}
