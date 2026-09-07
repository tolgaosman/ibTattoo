<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AppointmentStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\AppointmentResource;
use App\Models\Appointment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\Rule;

class AppointmentController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return AppointmentResource::collection(
            Appointment::query()->orderByDesc('created_at')->get()
        );
    }

    public function updateStatus(Request $request, Appointment $appointment): AppointmentResource
    {
        $data = $request->validate([
            'status' => ['required', Rule::enum(AppointmentStatus::class)],
        ]);

        $appointment->update($data);

        return new AppointmentResource($appointment);
    }

    public function destroy(Appointment $appointment): JsonResponse
    {
        $appointment->delete();

        return response()->json(['ok' => true]);
    }
}
