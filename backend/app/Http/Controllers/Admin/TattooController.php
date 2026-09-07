<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTattooRequest;
use App\Http\Requests\Admin\UpdateTattooRequest;
use App\Http\Resources\TattooResource;
use App\Models\Setting;
use App\Models\Tattoo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TattooController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return TattooResource::collection(Tattoo::query()->orderBy('id')->get());
    }

    public function store(StoreTattooRequest $request): TattooResource
    {
        $data = $request->validated();

        $tattoo = Tattoo::query()->create([
            'public_id' => $data['id'],
            'slug' => $data['slug'],
            'title' => $data['title'],
            'style' => $data['style'],
            'size' => $data['size'],
            'tattoo_date' => $data['date'],
            'placement' => $data['placement'],
            'duration' => $data['duration'],
            'story' => $data['story'],
            'aspect' => $data['aspect'],
            'image_path' => $data['image'],
            'credit' => $data['credit'],
        ]);

        return new TattooResource($tattoo);
    }

    public function update(UpdateTattooRequest $request, Tattoo $tattoo): TattooResource
    {
        $data = $request->validated();

        if (array_key_exists('date', $data)) {
            $data['tattoo_date'] = $data['date'];
            unset($data['date']);
        }
        if (array_key_exists('image', $data)) {
            $data['image_path'] = $data['image'];
            unset($data['image']);
        }

        $tattoo->update($data);

        return new TattooResource($tattoo);
    }

    public function destroy(Tattoo $tattoo): JsonResponse
    {
        $publicId = $tattoo->public_id;
        $tattoo->delete();

        // Mirrors the old lib/db.ts deleteTattoo(), which also pruned the
        // board selection when a featured piece was removed.
        $board = collect(Setting::getValue('board_selection', []))
            ->reject(fn ($id) => $id === $publicId)
            ->values()
            ->all();
        Setting::putValue('board_selection', $board);

        return response()->json(['ok' => true]);
    }
}
