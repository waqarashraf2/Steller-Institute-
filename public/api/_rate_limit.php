<?php

/**
 * File-backed form throttling for shared cPanel hosting.
 * The state lives in the account home directory, outside public_html, and
 * flock keeps counts consistent across concurrent PHP workers.
 */
function stellar_ip_in_cidr($ip, $cidr)
{
    $parts = explode('/', $cidr, 2);
    $address = @inet_pton($ip);
    $network = @inet_pton($parts[0]);

    if ($address === false || $network === false || strlen($address) !== strlen($network)) {
        return false;
    }

    $prefix = isset($parts[1]) ? (int) $parts[1] : strlen($network) * 8;
    $totalBits = strlen($network) * 8;
    if ($prefix < 0 || $prefix > $totalBits) {
        return false;
    }

    $wholeBytes = intdiv($prefix, 8);
    if ($wholeBytes > 0 && substr($address, 0, $wholeBytes) !== substr($network, 0, $wholeBytes)) {
        return false;
    }

    $remainingBits = $prefix % 8;
    if ($remainingBits > 0) {
        $mask = (0xff << (8 - $remainingBits)) & 0xff;
        if ((ord($address[$wholeBytes]) & $mask) !== (ord($network[$wholeBytes]) & $mask)) {
            return false;
        }
    }

    return true;
}

function stellar_is_cloudflare_proxy($ip)
{
    // Current official proxy ranges: https://www.cloudflare.com/ips-v4/ and /ips-v6/.
    $ranges = [
        '173.245.48.0/20', '103.21.244.0/22', '103.22.200.0/22', '103.31.4.0/22',
        '141.101.64.0/18', '108.162.192.0/18', '190.93.240.0/20', '188.114.96.0/20',
        '197.234.240.0/22', '198.41.128.0/17', '162.158.0.0/15', '104.16.0.0/13',
        '104.24.0.0/14', '172.64.0.0/13', '131.0.72.0/22',
        '2400:cb00::/32', '2606:4700::/32', '2803:f800::/32', '2405:b500::/32',
        '2405:8100::/32', '2a06:98c0::/29', '2c0f:f248::/32',
    ];

    foreach ($ranges as $range) {
        if (stellar_ip_in_cidr($ip, $range)) {
            return true;
        }
    }

    return false;
}

function stellar_form_client_ip()
{
    $remoteAddress = trim(isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '');
    if (filter_var($remoteAddress, FILTER_VALIDATE_IP) === false) {
        return 'unknown';
    }

    // Trust Cloudflare's client-IP header only when the TCP peer is a Cloudflare IP.
    $cloudflareAddress = trim(isset($_SERVER['HTTP_CF_CONNECTING_IP']) ? $_SERVER['HTTP_CF_CONNECTING_IP'] : '');
    if (
        filter_var($cloudflareAddress, FILTER_VALIDATE_IP) !== false &&
        stellar_is_cloudflare_proxy($remoteAddress)
    ) {
        $remoteAddress = $cloudflareAddress;
    }

    $packedAddress = @inet_pton($remoteAddress);
    $normalizedAddress = $packedAddress === false ? false : @inet_ntop($packedAddress);
    return $normalizedAddress === false ? 'unknown' : $normalizedAddress;
}

function stellar_rate_limit_secret($directory)
{
    $secretPath = $directory . DIRECTORY_SEPARATOR . 'secret.key';
    $handle = @fopen($secretPath, 'c+');
    if ($handle === false || !flock($handle, LOCK_EX)) {
        if ($handle !== false) {
            fclose($handle);
        }
        error_log('Stellar form rate limiter could not access its private key file.');
        return false;
    }

    @chmod($secretPath, 0600);
    rewind($handle);
    $secret = stream_get_contents($handle);
    if (!is_string($secret) || strlen($secret) < 32) {
        try {
            $secret = random_bytes(32);
        } catch (Exception $exception) {
            flock($handle, LOCK_UN);
            fclose($handle);
            error_log('Stellar form rate limiter could not create its private key.');
            return false;
        }

        $saved = ftruncate($handle, 0);
        if ($saved) {
            rewind($handle);
            $saved = fwrite($handle, $secret) === strlen($secret) && fflush($handle);
        }
        if (!$saved) {
            flock($handle, LOCK_UN);
            fclose($handle);
            error_log('Stellar form rate limiter could not save its private key.');
            return false;
        }
    }

    flock($handle, LOCK_UN);
    fclose($handle);
    return $secret;
}

/**
 * Return the retry delay in seconds, or zero when this request is allowed.
 */
function stellar_form_rate_limit($form, $maxRequests = 5, $windowSeconds = 900)
{
    $maxRequests = max(1, (int) $maxRequests);
    $windowSeconds = max(1, (int) $windowSeconds);
    $form = strtolower(preg_replace('/[^a-z0-9_-]/i', '', (string) $form));

    $configuredDirectory = getenv('STELLAR_FORM_RATE_LIMIT_DIR');
    $directory = $configuredDirectory
        ? rtrim($configuredDirectory, DIRECTORY_SEPARATOR)
        : dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . '.stellar-form-rate-limits';

    if (!is_dir($directory) && !@mkdir($directory, 0700, true) && !is_dir($directory)) {
        error_log('Stellar form rate limiter could not create its private storage directory.');
        return 0; // Keep forms available if shared-host storage is temporarily unavailable.
    }
    if (!is_writable($directory)) {
        error_log('Stellar form rate limiter storage is not writable.');
        return 0;
    }

    $secret = stellar_rate_limit_secret($directory);
    if ($secret === false) {
        return 0;
    }

    $clientKey = hash_hmac('sha256', $form . "\0" . stellar_form_client_ip(), $secret);
    @chmod($directory, 0700);
    $filePath = $directory . DIRECTORY_SEPARATOR . 'requests.json';
    $handle = @fopen($filePath, 'c+');
    if ($handle === false) {
        error_log('Stellar form rate limiter could not open its private storage file.');
        return 0;
    }

    @chmod($filePath, 0600);
    if (!flock($handle, LOCK_EX)) {
        fclose($handle);
        error_log('Stellar form rate limiter could not lock its private storage file.');
        return 0;
    }

    rewind($handle);
    $contents = stream_get_contents($handle);
    $records = json_decode($contents === false ? '' : $contents, true);
    if (!is_array($records)) {
        $records = [];
    }

    $now = time();
    $cutoff = $now - $windowSeconds;
    foreach ($records as $key => $timestamps) {
        if (!is_array($timestamps)) {
            unset($records[$key]);
            continue;
        }

        $recent = [];
        foreach ($timestamps as $timestamp) {
            if (is_numeric($timestamp) && (int) $timestamp > $cutoff && (int) $timestamp <= $now) {
                $recent[] = (int) $timestamp;
            }
        }
        sort($recent, SORT_NUMERIC);
        if ($recent) {
            $records[$key] = $recent;
        } else {
            unset($records[$key]);
        }
    }

    $attempts = isset($records[$clientKey]) ? $records[$clientKey] : [];
    $retryAfter = 0;
    if (count($attempts) >= $maxRequests) {
        $retryAfter = max(1, $attempts[0] + $windowSeconds - $now);
    } else {
        $attempts[] = $now;
        $records[$clientKey] = $attempts;
    }

    // Bound file growth if a high number of distinct clients arrive in the window.
    if (count($records) > 5000) {
        uasort($records, function ($left, $right) {
            return end($left) <=> end($right);
        });
        $records = array_slice($records, -5000, null, true);
    }

    $encoded = json_encode($records);
    if ($encoded !== false && ftruncate($handle, 0)) {
        rewind($handle);
        fwrite($handle, $encoded);
        fflush($handle);
    }

    flock($handle, LOCK_UN);
    fclose($handle);
    return $retryAfter;
}

function stellar_enforce_form_rate_limit($form, $maxRequests = 5, $windowSeconds = 900)
{
    $retryAfter = stellar_form_rate_limit($form, $maxRequests, $windowSeconds);
    if ($retryAfter < 1) {
        return;
    }

    http_response_code(429);
    header('Retry-After: ' . $retryAfter);
    header('Cache-Control: no-store');
    echo json_encode([
        'success' => false,
        'error' => 'Too many submissions. Please try again later.',
    ]);
    exit;
}
