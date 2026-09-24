<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\LoginRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /** Failed attempts allowed per IP+email pair before a lockout. */
    private const MAX_ATTEMPTS = 5;

    /** Lockout window once MAX_ATTEMPTS is exceeded. */
    private const DECAY_SECONDS = 900;

    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->validated();

        // Keyed on IP+email, not IP alone: nginx's own per-IP limit_req on
        // this route already bounds a single attacker, but this survives
        // behind a shared/proxied IP and specifically protects this one
        // account from being guessed against.
        $throttleKey = 'admin-login:'.$request->ip().'|'.strtolower($credentials['email']);

        if (RateLimiter::tooManyAttempts($throttleKey, self::MAX_ATTEMPTS)) {
            $seconds = RateLimiter::availableIn($throttleKey);

            throw ValidationException::withMessages([
                'password' => ["Çok fazla başarısız deneme. {$seconds} saniye sonra tekrar deneyin."],
            ]);
        }

        $user = User::query()->where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            RateLimiter::hit($throttleKey, self::DECAY_SECONDS);

            // No password/token value logged — only that an attempt failed.
            Log::warning('Admin login failed', [
                'ip' => $request->ip(),
                'email' => $credentials['email'],
            ]);

            throw ValidationException::withMessages([
                'password' => ['Hatalı e-posta veya şifre.'],
            ]);
        }

        RateLimiter::clear($throttleKey);

        // Single admin account — a fresh login invalidates every token issued
        // to it before, so a stolen-but-unused token can't outlive a
        // password change or accumulate indefinitely.
        $user->tokens()->delete();

        $token = $user->createToken(
            'admin-panel',
            ['*'],
            now()->addMinutes((int) config('sanctum.expiration')),
        )->plainTextToken;

        return response()->json(['token' => $token]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()?->currentAccessToken()?->delete();

        return response()->json(['ok' => true]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['email' => $request->user()->email]);
    }
}
