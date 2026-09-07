<?php

use App\Enums\TattooAspect;
use App\Enums\TattooSize;
use App\Enums\TattooStyle;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tattoos', function (Blueprint $table) {
            $table->id();
            // Frontend-facing identifier (Tattoo.id in lib/tattoos.ts) — kept
            // separate from the internal auto-increment PK so imported/legacy
            // ids survive untouched.
            $table->string('public_id')->unique();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('style')->default(TattooStyle::InceCizgi->value);
            $table->string('size')->default(TattooSize::Orta->value);
            $table->date('tattoo_date');
            $table->string('placement');
            $table->string('duration');
            $table->text('story');
            $table->string('aspect')->default(TattooAspect::Portrait->value);
            $table->string('image_path');
            $table->string('credit')->default('Irmak Bozkurt');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tattoos');
    }
};
