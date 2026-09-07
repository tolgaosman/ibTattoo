#!/bin/bash
set -e

# Wait for MySQL to be ready
echo "Waiting for database connection..."
until mysql -h "$DB_HOST" -u "$DB_USERNAME" -p"$DB_PASSWORD" -e "status" > /dev/null 2>&1; do
  echo "MySQL is unavailable - sleeping"
  sleep 2
done
echo "MySQL is up - continuing"

# Setup Laravel (if not already done)
if [ ! -f .env ]; then
  echo "Copying .env.example to .env..."
  cp .env.example .env
  php artisan key:generate
fi

echo "Running migrations..."
php artisan migrate --force

echo "Creating storage link..."
php artisan storage:link || true

echo "Optimizing application..."
php artisan optimize:clear
php artisan optimize

# Execute CMD (php-fpm)
exec "$@"
