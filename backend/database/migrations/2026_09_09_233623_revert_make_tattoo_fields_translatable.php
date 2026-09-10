<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Loosen the columns to plain text first — while they're still `json`,
        // MySQL rejects writing a decoded plain string back into them.
        Schema::table('tattoos', function (Blueprint $table) {
            $table->text('title')->change();
            $table->text('placement')->change();
            $table->text('duration')->nullable()->change();
            $table->text('story')->nullable()->change();
        });

        // Revert JSON data back to String
        $tattoos = DB::table('tattoos')->get();
        foreach ($tattoos as $tattoo) {
            $title = json_decode($tattoo->title, true)['tr'] ?? $tattoo->title ?? '';
            $placement = json_decode($tattoo->placement, true)['tr'] ?? $tattoo->placement ?? '';
            $duration = json_decode($tattoo->duration, true)['tr'] ?? $tattoo->duration ?? '';
            $story = json_decode($tattoo->story, true)['tr'] ?? $tattoo->story ?? '';

            DB::table('tattoos')->where('id', $tattoo->id)->update([
                'title' => $title,
                'placement' => $placement,
                'duration' => $duration,
                'story' => $story,
            ]);
        }

        // Change the columns to their final string/text type
        Schema::table('tattoos', function (Blueprint $table) {
            $table->string('title')->change();
            $table->string('placement')->change();
            $table->string('duration')->nullable()->change();
            $table->text('story')->nullable()->change();
        });
    }

    public function down(): void
    {
        $tattoos = DB::table('tattoos')->get();
        foreach ($tattoos as $tattoo) {
            DB::table('tattoos')->where('id', $tattoo->id)->update([
                'title' => json_encode(['tr' => $tattoo->title]),
                'placement' => json_encode(['tr' => $tattoo->placement]),
                'duration' => json_encode(['tr' => $tattoo->duration]),
                'story' => json_encode(['tr' => $tattoo->story]),
            ]);
        }

        Schema::table('tattoos', function (Blueprint $table) {
            $table->json('title')->change();
            $table->json('placement')->change();
            $table->json('duration')->change();
            $table->json('story')->change();
        });
    }
};
