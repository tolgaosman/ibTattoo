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
        if ($request->has('data')) {
            $base64 = $request->input('data');
            $filenameInput = $request->input('filename', 'gorsel.jpg');
            
            if (str_contains($base64, ',')) {
                $base64 = explode(',', $base64)[1];
            }
            
            $fileData = base64_decode($base64);
            $name = Str::slug(pathinfo($filenameInput, PATHINFO_FILENAME));
            $extension = pathinfo($filenameInput, PATHINFO_EXTENSION) ?: 'jpg';
            $filename = sprintf('%s-%d-%s.%s', $name ?: 'gorsel', now()->timestamp, Str::random(6), $extension);
            
            $path = 'tattoos/' . $filename;
            Storage::disk('public')->put($path, $fileData);
        } else {
            $file = $request->file('file');
            $name = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME));
            $filename = sprintf('%s-%d-%s.%s', $name ?: 'gorsel', now()->timestamp, Str::random(6), $file->getClientOriginalExtension() ?: 'jpg');
            $path = $file->storeAs('tattoos', $filename, 'public');
        }

        return response()->json(['url' => '/api/storage/' . $path]);
    }
}
