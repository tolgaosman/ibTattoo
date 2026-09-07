#!/bin/bash
set -e

# Wait for MySQL to be ready
echo "Waiting for database connection..."
until php -r "try { new PDO('mysql:host=' . getenv('DB_HOST') . ';dbname=' . getenv('DB_DATABASE'), getenv('DB_USERNAME'), getenv('DB_PASSWORD')); } catch (Exception \$e) { exit(1); }"; do
  echo "MySQL is unavailable - sleeping"
  sleep 2
done
echo "MySQL is up - continuing"

# Setup Laravel (if not already done)
if [ ! -f .env ]; then
  echo "Copying .env.example to .env..."
  cp .env.example .env
fi

if ! grep -q "^APP_KEY=base64:" .env; then
  echo "Generating APP_KEY..."
  php artisan key:generate --force
fi

echo "Running migrations..."
php artisan migrate --force

echo "Syncing admin account..."
php artisan db:seed --class=AdminUserSeeder --force

echo "Creating storage link..."
php artisan storage:link || true

# Caching is a performance step, not a correctness one — an uncached Laravel
# serves every request correctly, just a little slower. Under `set -e` a failing
# cache step would kill the entrypoint before `exec php-fpm` below, taking the
# whole site down with a 502; degrade to "slower" instead of "offline".
echo "Optimizing application..."
php artisan optimize:clear || echo "WARNING: optimize:clear failed, continuing"
php artisan optimize || echo "WARNING: optimize failed, continuing uncached"

# Execute CMD (php-fpm)
exec "$@"
