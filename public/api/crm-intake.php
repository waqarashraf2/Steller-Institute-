<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-store");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$rawBody = file_get_contents('php://input');
if (!is_string($rawBody) || strlen($rawBody) > 16384) {
    http_response_code(413);
    echo json_encode(['success' => false, 'error' => 'Submission is too large']);
    exit;
}

$input = json_decode($rawBody, true);
if (!is_array($input) || !isset($input['form'], $input['payload']) || !is_array($input['payload'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid submission']);
    exit;
}

$form = $input['form'];
$endpoints = [
    'campaign' => 'https://crm.stellarinstitute.pk/api/api/v1/public/campaign-lead',
    'admission' => 'https://crm.stellarinstitute.pk/api/api/v1/public/online-admission',
    'contact' => 'https://crm.stellarinstitute.pk/api/api/v1/public/online-admission',
];

if (!is_string($form) || !isset($endpoints[$form])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid submission type']);
    exit;
}

require_once __DIR__ . '/_rate_limit.php';
stellar_enforce_form_rate_limit('crm_' . $form, 5, 900);

function stellar_crm_field($source, $name, $maxLength, &$valid)
{
    if (!array_key_exists($name, $source) || $source[$name] === null) {
        return null;
    }
    if (!is_string($source[$name])) {
        $valid = false;
        return null;
    }

    $value = trim($source[$name]);
    if (strlen($value) > $maxLength || preg_match('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', $value)) {
        $valid = false;
        return null;
    }
    return $value === '' ? null : $value;
}

$source = $input['payload'];
$valid = true;
if ($form === 'campaign') {
    $payload = [
        'name' => stellar_crm_field($source, 'name', 120, $valid),
        'phone' => stellar_crm_field($source, 'phone', 40, $valid),
        'location' => stellar_crm_field($source, 'location', 120, $valid),
        'course' => stellar_crm_field($source, 'course', 160, $valid),
        'campaign' => stellar_crm_field($source, 'campaign', 120, $valid),
        'email' => stellar_crm_field($source, 'email', 254, $valid),
    ];
    $requiredFields = ['name', 'phone'];
} else {
    $payload = [
        'student_name' => stellar_crm_field($source, 'student_name', 120, $valid),
        'father_name' => stellar_crm_field($source, 'father_name', 120, $valid),
        'phone' => stellar_crm_field($source, 'phone', 40, $valid),
        'cnic' => stellar_crm_field($source, 'cnic', 50, $valid),
        'batch_timing' => stellar_crm_field($source, 'batch_timing', 80, $valid),
        'education_level' => stellar_crm_field($source, 'education_level', 160, $valid),
        'expected_joining_date' => stellar_crm_field($source, 'expected_joining_date', 20, $valid),
        'course_name' => stellar_crm_field($source, 'course_name', 200, $valid),
    ];
    $requiredFields = ['student_name', 'phone'];
}

foreach ($requiredFields as $requiredField) {
    if (empty($payload[$requiredField])) {
        $valid = false;
    }
}

if (!$valid) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Please check the submitted details']);
    exit;
}

if (!function_exists('curl_init')) {
    http_response_code(503);
    echo json_encode(['success' => false, 'error' => 'The admissions service is temporarily unavailable']);
    exit;
}

$encodedPayload = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
if ($encodedPayload === false) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid submission']);
    exit;
}

$curl = curl_init($endpoints[$form]);
if ($curl === false) {
    http_response_code(503);
    echo json_encode(['success' => false, 'error' => 'The admissions service is temporarily unavailable']);
    exit;
}

curl_setopt_array($curl, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $encodedPayload,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'Accept: application/json'],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 5,
    CURLOPT_TIMEOUT => 15,
    CURLOPT_FOLLOWLOCATION => false,
]);

$upstreamBody = curl_exec($curl);
$upstreamStatus = (int) curl_getinfo($curl, CURLINFO_HTTP_CODE);
$curlFailed = $upstreamBody === false;
curl_close($curl);

$upstreamData = is_string($upstreamBody) ? json_decode($upstreamBody, true) : null;
$upstreamRejected = is_array($upstreamData) && (
    ($upstreamData['success'] ?? null) === false ||
    in_array(strtolower((string) ($upstreamData['status'] ?? '')), ['error', 'failed', 'failure'], true)
);

if ($curlFailed || $upstreamStatus < 200 || $upstreamStatus >= 300 || $upstreamRejected) {
    $responseStatus = $upstreamStatus === 429 ? 429 : 502;
    http_response_code($responseStatus);
    echo json_encode([
        'success' => false,
        'error' => $responseStatus === 429
            ? 'Too many submissions. Please try again later.'
            : 'The admissions service could not receive your submission. Please try again.',
    ]);
    exit;
}

echo json_encode(['success' => true]);
