#!/bin/bash
cd /var/www/ibTattoo

echo "=== hangi volume'ler var, hangi projeye ait ==="
docker volume ls | grep -i ibtattoo

echo "=== backend'in yazdığı yerde son yüklenen dosyalar ==="
docker compose exec backend ls -la storage/app/public/tattoos/ | tail -8

echo "=== web (nginx) container'ının AYNI dosyaları görüp görmediği ==="
docker compose exec web ls -la /var/www/backend/storage/app/public/tattoos/ | tail -8

echo "=== DB'de bozulan /api/storage yollarını düzeltiyoruz ==="
docker compose exec backend php artisan tinker --execute="foreach (DB::table('tattoos')->get() as \$t) { if (str_starts_with(\$t->image_path, '/api/storage/')) { DB::table('tattoos')->where('id', \$t->id)->update(['image_path' => str_replace('/api/storage/', '/storage/', \$t->image_path)]); } } echo 'Tattoos sabitlendi.'.PHP_EOL;"
docker compose exec backend php artisan tinker --execute="\$val = DB::table('settings')->where('key','about_image')->value('value'); if (str_starts_with(\$val, '/api/storage/')) { DB::table('settings')->where('key','about_image')->update(['value' => str_replace('/api/storage/', '/storage/', \$val)]); } echo 'Hakkimda resmi sabitlendi.'.PHP_EOL;"

echo "=== DB'de gerçekten ne kayıtlı ==="
docker compose exec backend php artisan tinker --execute="foreach (DB::table('tattoos')->orderByDesc('id')->limit(3)->get() as \$t) { echo \$t->public_id.' => '.\$t->image_path.PHP_EOL; } echo 'about_image => '.DB::table('settings')->where('key','about_image')->value('value').PHP_EOL;"

echo "=== en olası düzeltme: web container'ı compose'daki güncel volume tanımıyla yeniden oluştur ==="
docker compose up -d --force-recreate web

echo "=== tekrar dene ==="
curl -I http://localhost:4002/storage/tattoos/yuta2-1788811871-mUK2Bx.jpg
