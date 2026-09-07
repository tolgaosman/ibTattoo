<?php

use App\Http\Controllers\Admin\AppointmentController as AdminAppointmentController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\ContentController as AdminContentController;
use App\Http\Controllers\Admin\TattooController as AdminTattooController;
use App\Http\Controllers\Admin\UploadController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\ContentController;
use App\Http\Controllers\TattooController;
use Illuminate\Support\Facades\Route;

// Public — consumed by the Next.js server (frontend/lib/db.ts, lib/api.ts).
Route::get('/content', ContentController::class);
Route::get('/tattoos', [TattooController::class, 'index']);
Route::post('/appointments', [AppointmentController::class, 'store'])
    ->middleware('throttle:5,1');

Route::post('/admin/login', [AuthController::class, 'login'])
    ->middleware('throttle:10,1');

// Admin — behind Sanctum tokens, called only by the Next.js server (BFF),
// never directly from the browser.
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::put('/content/about', [AdminContentController::class, 'updateAbout']);
    Route::put('/content/process', [AdminContentController::class, 'updateProcess']);
    Route::put('/content/board-selection', [AdminContentController::class, 'updateBoardSelection']);
    Route::put('/content/contact', [AdminContentController::class, 'updateContact']);

    Route::get('/tattoos', [AdminTattooController::class, 'index']);
    Route::post('/tattoos', [AdminTattooController::class, 'store']);
    Route::put('/tattoos/{tattoo:public_id}', [AdminTattooController::class, 'update']);
    Route::delete('/tattoos/{tattoo:public_id}', [AdminTattooController::class, 'destroy']);

    Route::post('/uploads', [UploadController::class, 'store']);

    Route::get('/appointments', [AdminAppointmentController::class, 'index']);
    Route::patch('/appointments/{appointment}', [AdminAppointmentController::class, 'updateStatus']);
    Route::delete('/appointments/{appointment}', [AdminAppointmentController::class, 'destroy']);
});
