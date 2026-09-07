# ibTattoo

Irmak Bozkurt için dövme portfolyo sitesi. İki ayrı proje, tek repo:

- **`frontend/`** — Next.js 16 (App Router). Herkese açık site + admin paneli. Sunucu tarafında Laravel API'yi çağırır (BFF); tarayıcı hiçbir zaman API'ye doğrudan istek atmaz.
- **`backend/`** — Laravel 12 API. İçerik, galeri ve randevu taleplerini MySQL'de (lokalde SQLite) tutar, Sanctum token'larıyla admin uçlarını korur, galeri görsellerini `storage/app/public` altında saklar.

## Lokal geliştirme

İki sunucu da ayakta olmalı:

```bash
# Terminal 1 — backend
cd backend
cp .env.example .env        # zaten yoksa
php artisan key:generate
php artisan migrate --seed  # tabloları kurar + mevcut içerik/9 dövmeyi + admin kullanıcıyı yükler
php artisan storage:link
php artisan serve           # http://127.0.0.1:8000

# Terminal 2 — frontend
cd frontend
cp .env.example .env.local  # API_URL=http://127.0.0.1:8000/api
npm install
npm run dev                 # http://localhost:3000
```

Admin girişi: `.env`'deki `ADMIN_EMAIL` / `ADMIN_PASSWORD` (varsayılan `irmakyamuer2000@gmail.com` / seed sırasında belirlediğiniz şifre) — `/admin/login`'de yalnızca şifre istenir.

## Mimari notu

Next.js'in server component'leri ve route handler'ları Laravel'i `API_URL` üzerinden çağırır; admin oturumu httpOnly bir çerezde tutulan Sanctum token'ı ile yürür ve hiçbir zaman tarayıcı JS'ine açılmaz. Bu sayede CORS'a neredeyse hiç ihtiyaç yok ve admin panelinin mevcut bileşenleri (`GalleryManager`, `DashboardForms`, `SettingsForm`) değişmeden kalıyor.

## Hetzner'e canlıya alma (özet)

1. **Backend**: `composer install --no-dev --optimize-autoloader`, `.env`'de `DB_CONNECTION=mysql` ve gerçek kimlik bilgileri, `php artisan migrate --seed --force`, `php artisan storage:link`, Nginx + PHP-FPM (veya Herd) arkasında çalıştırın.
2. **Frontend**: `npm run build && npm run start` (Node sunucu gerekir — admin paneli ve API route'ları statik export ile uyumlu değil). `API_URL`'i backend'in genel URL'ine ayarlayın.
3. Nginx'te iki alan adı/yolu backend'e (`api.` alt alan adı önerilir) ve ana alan adını frontend'e yönlendirin.

`frontend/scripts/build-pages.mjs` ile üretilen GitHub Pages statik exportu hâlâ mevcut ama artık ikincil bir seçenek — admin paneli ve içerik API'den geldiği için export'un yayında kalması API'nin de ayakta olmasını gerektirir.
