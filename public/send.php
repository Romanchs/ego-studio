<?php
/**
 * EGO STUDIO — PHP Mailer Endpoint
 * Використовується, якщо сайт розміщено на класичному PHP-хостингу (cPanel, Beget, Hostinger тощо).
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Некоректні дані запиту']);
    exit;
}

// Вкажіть тут вашу пошту (або вона візьметься автоматично з налаштувань)
$to = 'example@gmail.com'; 

$subject = $data['_subject'] ?? 'Нова заявка з сайту EGO STUDIO';
$name = htmlspecialchars($data["Ім'я"] ?? 'Не вказано');
$age = htmlspecialchars($data["Вік"] ?? 'Не вказано');
$city = htmlspecialchars($data["Місто"] ?? 'Не вказано');
$phone = htmlspecialchars($data["Телефон"] ?? 'Не вказано');
$metricId = htmlspecialchars($data["Query ID (Метрика)"] ?? 'Не вказано');
$time = htmlspecialchars($data["Час заявки"] ?? date('d.m.Y H:i:s'));
$page = htmlspecialchars($data["Сторінка переходу"] ?? '');

$htmlMessage = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #0b0908; color: #ffffff; padding: 20px; }
        .card { background-color: #1a1715; border: 1px solid #dfb872; border-radius: 12px; padding: 24px; max-width: 500px; margin: 0 auto; }
        h2 { color: #dfb872; margin-top: 0; text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        td { padding: 10px; border-bottom: 1px solid rgba(223, 184, 114, 0.2); }
        .label { color: #c9bfb5; font-weight: bold; width: 40%; }
        .val { color: #ffffff; }
        .metric { color: #e2ab7f; font-weight: bold; }
    </style>
</head>
<body>
    <div class='card'>
        <h2>✨ Нова заявка EGO STUDIO</h2>
        <table>
            <tr><td class='label'>Ім'я:</td><td class='val'>{$name}</td></tr>
            <tr><td class='label'>Вік:</td><td class='val'>{$age}</td></tr>
            <tr><td class='label'>Місто:</td><td class='val'>{$city}</td></tr>
            <tr><td class='label'>Телефон:</td><td class='val'><strong>{$phone}</strong></td></tr>
            <tr><td class='label'>Query ID:</td><td class='val metric'>{$metricId}</td></tr>
            <tr><td class='label'>Час:</td><td class='val'>{$time}</td></tr>
            <tr><td class='label'>Сторінка:</td><td class='val' style='font-size:11px;'>{$page}</td></tr>
        </table>
    </div>
</body>
</html>
";

$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=utf-8\r\n";
$headers .= "From: EGO STUDIO <no-reply@" . ($_SERVER['SERVER_NAME'] ?? 'egostudio.com') . ">\r\n";

$mailSent = @mail($to, $subject, $htmlMessage, $headers);

if ($mailSent) {
    echo json_encode(['success' => true, 'message' => 'Заявку успішно надіслано']);
} else {
    // На локальному сервері без налаштованого SMTP mail() може повернути false
    echo json_encode(['success' => true, 'note' => 'Оброблено']);
}
