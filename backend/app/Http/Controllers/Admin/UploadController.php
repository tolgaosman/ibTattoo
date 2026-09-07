<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UploadImageRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    public function store(UploadImageRequest $request): JsonResponse
    {
        $file = $request->file('file');

        $name = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME));
        $filename = sprintf('%s-%d-%s.%s', $name ?: 'gorsel', now()->timestamp, Str::random(6), $file->getClientOriginalExtension() ?: 'jpg');

        $path = $file->storeAs('tattoos', $filename, 'public');

        return response()->json(['url' => '/storage/' . $path]);
    }
}
