<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateAboutRequest;
use App\Http\Requests\Admin\UpdateBoardSelectionRequest;
use App\Http\Requests\Admin\UpdateContactRequest;
use App\Http\Requests\Admin\UpdateProcessRequest;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;

class ContentController extends Controller
{
    public function updateAbout(UpdateAboutRequest $request): JsonResponse
    {
        Setting::putValue('about', $request->validated('about'));

        if ($request->has('aboutImage')) {
            Setting::putValue('about_image', $request->validated('aboutImage'));
        }

        return response()->json(['ok' => true]);
    }

    public function updateProcess(UpdateProcessRequest $request): JsonResponse
    {
        Setting::putValue('process', $request->validated('process'));

        return response()->json(['ok' => true]);
    }

    public function updateBoardSelection(UpdateBoardSelectionRequest $request): JsonResponse
    {
        Setting::putValue('board_selection', $request->validated('boardSelection'));

        return response()->json(['ok' => true]);
    }

    public function updateContact(UpdateContactRequest $request): JsonResponse
    {
        Setting::putValue('contact', $request->validated());

        return response()->json(['ok' => true]);
    }
}
