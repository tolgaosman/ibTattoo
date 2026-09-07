<?php
// Parse DB credentials from .env
$env = parse_ini_file(__DIR__ . '/../.env');
$pdo = new PDO(
    "mysql:host={$env['DB_HOST']};port={$env['DB_PORT']};dbname={$env['DB_DATABASE']};charset=utf8mb4",
    $env['DB_USERNAME'],
    $env['DB_PASSWORD']
);

$fixed = 0;

// Fix tattoos
$rows = $pdo->query("SELECT id, image_path FROM tattoos WHERE image_path LIKE '%://%'")->fetchAll(PDO::FETCH_ASSOC);
foreach ($rows as $row) {
    $path = preg_replace('#^.*?/storage/#', '', $row['image_path']);
    $newUrl = '/api/storage/' . $path;
    $pdo->prepare("UPDATE tattoos SET image_path = ? WHERE id = ?")->execute([$newUrl, $row['id']]);
    echo "Fixed tattoo: {$row['image_path']} => {$newUrl}<br>";
    $fixed++;
}

// Fix about_image in settings
$setting = $pdo->query("SELECT * FROM settings WHERE `key` = 'about_image'")->fetch(PDO::FETCH_ASSOC);
if ($setting && str_contains($setting['value'], '://')) {
    $path = preg_replace('#^.*?/storage/#', '', $setting['value']);
    $newUrl = '/api/storage/' . $path;
    $pdo->prepare("UPDATE settings SET value = ? WHERE `key` = 'about_image'")->execute([$newUrl]);
    echo "Fixed about_image: {$setting['value']} => {$newUrl}<br>";
    $fixed++;
}

echo "<br><strong>Done! $fixed URLs fixed.</strong>";
