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
     * Extensions we are willing to write into the public storage directory,
     * mapped from the IMAGETYPE_* constant `getimagesize()` reports for the
     * decoded bytes. The client-supplied filename only ever contributes the
     * human-readable slug portion of the stored name — never the extension —
     * so a mislabelled or malicious upload can't land with a trusted-looking
     * extension it doesn't actually have.
     */
    private const EXTENSION_BY_IMAGETYPE = [
        IMAGETYPE_JPEG => 'jpg',
        IMAGETYPE_PNG => 'png',
        IMAGETYPE_GIF => 'gif',
        IMAGETYPE_WEBP => 'webp',
    ];

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

            $extension = $this->detectExtension($fileData);

            if ($extension === null) {
                return response()->json(['message' => 'Geçerli bir görsel değil.'], 422);
            }

            $path = 'tattoos/' . $this->buildFilename($request->input('filename', 'gorsel'), $extension);

            Storage::disk('public')->put($path, $fileData);
        } else {
            $file = $request->file('file');
            $extension = $this->detectExtension((string) file_get_contents($file->getRealPath()));

            if ($extension === null) {
                return response()->json(['message' => 'Geçerli bir görsel değil.'], 422);
            }

            $path = $file->storeAs('tattoos', $this->buildFilename($file->getClientOriginalName(), $extension), 'public');

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

    /**
     * Decodes the actual image type from raw bytes and maps it to a safe
     * extension. Returns null when the bytes aren't a recognised raster
     * image (this rejects e.g. an SVG or HTML file smuggled past the
     * `image` validation rule, or any polyglot that isn't a real image).
     */
    private function detectExtension(string $bytes): ?string
    {
        $info = @getimagesizefromstring($bytes);

        if ($info === false) {
            return null;
        }

        return self::EXTENSION_BY_IMAGETYPE[$info[2]] ?? null;
    }

    private function buildFilename(string $original, string $extension): string
    {
        $name = Str::slug(pathinfo($original, PATHINFO_FILENAME)) ?: 'gorsel';

        return sprintf('%s-%d-%s.%s', $name, now()->timestamp, Str::random(6), $extension);
    }
}
