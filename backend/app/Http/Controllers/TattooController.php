<?php

namespace App\Http\Controllers;

use App\Http\Resources\TattooResource;
use App\Models\Tattoo;

class TattooController extends Controller
{
    public function index(): \Illuminate\Http\Resources\Json\AnonymousResourceCollection
    {
        return TattooResource::collection(Tattoo::query()->orderBy('id')->get());
    }
}
