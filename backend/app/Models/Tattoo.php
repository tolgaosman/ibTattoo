<?php

namespace App\Models;

use App\Enums\TattooAspect;
use App\Enums\TattooSize;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tattoo extends Model
{
    use HasFactory;

    protected $fillable = [
        'public_id',
        'slug',
        'title',
        'style',
        'size',
        'tattoo_date',
        'placement',
        'duration',
        'story',
        'aspect',
        'image_path',
        'credit',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'size' => TattooSize::class,
            'aspect' => TattooAspect::class,
            'tattoo_date' => 'date',
        ];
    }
}
