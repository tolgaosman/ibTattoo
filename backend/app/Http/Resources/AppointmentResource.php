<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'contact' => $this->contact,
            'idea' => $this->idea,
            'placement' => $this->placement,
            'size' => $this->size,
            'reference' => $this->reference,
            'dates' => $this->preferred_dates,
            'status' => $this->status->value,
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
