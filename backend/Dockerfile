FROM php:8.4-fpm

# Install system dependencies. No `git`: every dependency in composer.lock
# resolves to a "dist" (zipball) source (preferred-install: dist in
# composer.json), so composer install never shells out to it — keeping it
# out of the image is one less tool available to an attacker who lands a
# shell in the container.
RUN apt-get update && apt-get install -y \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    default-mysql-client

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Allow larger file uploads (matches the 8MB validation limit in UploadImageRequest)
COPY docker/php/uploads.ini /usr/local/etc/php/conf.d/uploads.ini

# Pinned to the major version, not `:latest` — an unreviewed new Composer
# major version has no business getting pulled into a production image build
# without anyone looking at it first.
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy existing application directory contents
COPY . /var/www/html

# Install dependencies (ignoring scripts during build, they run in entrypoint)
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php-fpm"]
