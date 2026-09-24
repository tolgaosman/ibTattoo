<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAppointmentRequest;
use App\Models\Appointment;
use Illuminate\Http\JsonResponse;

class AppointmentController extends Controller
{
    public function store(StoreAppointmentRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['preferred_dates'] = $data['dates'] ?? null;
        unset($data['dates']);

        Appointment::query()->create([
            ...$data,
            'ip' => $request->ip(),
        ]);

        return response()->json(['ok' => true], 201);
    }
}
