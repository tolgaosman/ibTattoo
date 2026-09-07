<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAppointmentRequest;
use App\Models\Appointment;
use Illuminate\Http\JsonResponse;

class AppointmentController extends Controller
{
    public function store(StoreAppointmentRequest $request): JsonResponse
    {
        Appointment::query()->create([
            ...$request->validated(),
            'ip' => $request->ip(),
        ]);

        return response()->json(['ok' => true], 201);
    }
}
