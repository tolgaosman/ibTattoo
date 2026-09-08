---
name: security-guidance
description: Detailed security guidance and best practices for the project, focusing on Next.js frontend, Laravel backend, API security, and general OWASP best practices.
---

# Security Guidance

This skill provides comprehensive security best practices to be followed when developing, reviewing, or refactoring code in this project. The project architecture consists of a Next.js (App Router) frontend and a Laravel (API + Sanctum) backend.

## 1. Frontend Security (Next.js)

### 1.1 Cross-Site Scripting (XSS)
- **Data Binding:** React automatically escapes data bound to the DOM. Avoid using `dangerouslySetInnerHTML` unless absolutely necessary.
- **Sanitization:** If `dangerouslySetInnerHTML` is unavoidable, sanitize the input using a robust library like `DOMPurify` before rendering.
- **URL Validation:** Validate and sanitize all URLs before using them in `href` attributes to prevent `javascript:` URIs.

### 1.2 Authentication & State
- **Secure Cookies:** Store authentication tokens (like Sanctum tokens) in `httpOnly`, `Secure`, and `SameSite=Lax` or `Strict` cookies. Never store sensitive tokens in `localStorage` or `sessionStorage`.
- **Route Protection:** Use Next.js Middleware (`middleware.ts`) to verify authentication state before allowing access to protected routes (e.g., `/admin/*`).

### 1.3 Next.js Specifics
- **Server Actions / API Routes:** Treat all input as untrusted. Validate parameters using a schema validation library like `Zod`. Ensure authorization checks are performed inside the action itself.
- **Environment Variables:** Never expose sensitive secrets (API keys, DB credentials) to the browser. Only variables prefixed with `NEXT_PUBLIC_` are included in the client bundle.

## 2. Backend Security (Laravel)

### 2.1 API Authentication (Sanctum)
- **Token Scope:** If using tokens for different types of users, use token abilities to limit the scope of the token.
- **Expiration:** Ensure proper token invalidation during logout (`$user->currentAccessToken()->delete()`).

### 2.2 Mass Assignment & Injection
- **Mass Assignment:** Protect models against mass assignment vulnerabilities by explicitly defining the `$fillable` array.
- **SQL Injection:** Laravel's Query Builder and Eloquent use PDO parameter binding automatically. Avoid raw queries (`DB::raw()`) with user input. If required, always use bindings.

### 2.3 Cross-Site Request Forgery (CSRF)
- **API Protection:** For stateful SPAs using cookies, ensure Sanctum's CSRF protection is configured properly.

### 2.4 Data Validation
- **Form Requests:** Use Form Requests for all incoming data validation. Never trust `$request->all()`. Always use `$request->validated()` to retrieve safe, validated data.
- **Strict Typing:** Leverage PHP's strict types and strongly type method arguments and return values.

## 3. General Best Practices (OWASP Top 10)

- **Principle of Least Privilege:** Ensure database users, server processes, and API tokens have only the minimum necessary permissions.
- **Rate Limiting:** Protect public-facing endpoints (like login, appointments) with aggressive rate limiting to prevent brute-force and DDoS attacks.
- **Logging & Monitoring:** Log security-relevant events (failed logins, critical data changes) without logging sensitive PII, tokens, or passwords.
- **Dependency Management:** Keep dependencies (`npm` and `composer`) up to date. Regularly audit for vulnerabilities.
- **Error Handling:** Never expose stack traces or verbose error messages to the client in production (`APP_DEBUG=false`). Return generic, sanitized error messages.
