<?php

namespace App\Models;

use App\Enums\AppointmentStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'contact',
        'idea',
        'placement',
        'size',
        'reference',
        'preferred_dates',
        'status',
        'ip',
    ];

    protected function casts(): array
    {
        return [
            'status' => AppointmentStatus::class,
        ];
    }
}
