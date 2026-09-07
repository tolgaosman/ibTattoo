<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UploadImageRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    /**
     * Extensions we are willing to write into the public storage directory.
     * The extension is derived from a client-supplied filename, so anything
     * outside this list is coerced rather than trusted.
     */
    private const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

    /** Decoded byte ceiling, mirroring the `max:8192` (KB) rule on the multipart branch. */
    private const MAX_BYTES = 8192 * 1024;

    public function store(UploadImageRequest $request): JsonResponse
    {
        if ($request->filled('data')) {
            $base64 = $request->input('data');

            // Tolerate a full `data:` URI as well as a bare base64 payload.
            if (str_contains($base64, ',')) {
                $base64 = explode(',', $base64)[1];
            }

            $fileData = base64_decode($base64, true);

            if ($fileData === false || $fileData === '') {
                return response()->json(['message' => 'Görsel çözümlenemedi.'], 422);
            }

            if (strlen($fileData) > self::MAX_BYTES) {
                return response()->json(['message' => 'Görsel çok büyük (en fazla 8 MB).'], 422);
            }

            // The base64 branch never passes through Laravel's `image` rule, so
            // verify the decoded bytes really are an image before writing them
            // into a publicly served directory.
            if (@getimagesizefromstring($fileData) === false) {
                return response()->json(['message' => 'Geçerli bir görsel değil.'], 422);
            }

            $path = 'tattoos/' . $this->buildFilename($request->input('filename', 'gorsel.jpg'));

            Storage::disk('public')->put($path, $fileData);
        } else {
            $file = $request->file('file');
            $path = $file->storeAs('tattoos', $this->buildFilename($file->getClientOriginalName()), 'public');
            
            if ($path === false) {
                return response()->json(['message' => 'Dosya sunucuya kaydedilemedi. Depolama izni hatası olabilir.'], 500);
            }
        }

        // nginx serves this prefix straight off the shared storage volume
        // (docker/nginx/default.conf, `location /storage/`). It must NOT carry an
        // `/api/` prefix: that regex location is routed to PHP-FPM, and Laravel has
        // no route for it, so every such image 404s in production.
        return response()->json(['url' => '/storage/' . $path]);
    }

    private function buildFilename(string $original): string
    {
        $name = Str::slug(pathinfo($original, PATHINFO_FILENAME)) ?: 'gorsel';
        $extension = strtolower(pathinfo($original, PATHINFO_EXTENSION));

        if (! in_array($extension, self::ALLOWED_EXTENSIONS, true)) {
            $extension = 'jpg';
        }

        return sprintf('%s-%d-%s.%s', $name, now()->timestamp, Str::random(6), $extension);
    }
}
