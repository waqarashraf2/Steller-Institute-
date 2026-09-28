<?php
// CORS headers for the React frontend
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Get JSON body
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$required = ['name', 'email', 'subject', 'message'];
foreach ($required as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => "Missing required field: $field"]);
        exit;
    }
}

// Sanitize inputs
$name    = htmlspecialchars(strip_tags(trim($input['name'])));
$email   = filter_var(trim($input['email']), FILTER_SANITIZE_EMAIL);
$phone   = htmlspecialchars(strip_tags(trim($input['phone'] ?? 'Not provided')));
$subject = htmlspecialchars(strip_tags(trim($input['subject'])));
$message = htmlspecialchars(strip_tags(trim($input['message'])));

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid email address']);
    exit;
}

// Map subject codes to readable names
$subjectMap = [
    'admission' => 'Admission Inquiry',
    'courses'   => 'Course Information',
    'fees'      => 'Fee Structure',
    'general'   => 'General Inquiry'
];
$subjectLabel = $subjectMap[$subject] ?? $subject;

// ── Stellar Institute's receiving email ──
$to = "info@stellarinstitute.pk"; // Local cPanel email for direct delivery

// Build the email
$emailSubject = "New Website Inquiry: $subjectLabel";

$emailBody = "
<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
</head>
<body style=\"font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 40px 20px; -webkit-font-smoothing: antialiased;\">
    <table width='100%' border='0' cellspacing='0' cellpadding='0' style=\"background-color: #f3f4f6;\">
        <tr>
            <td align='center' style=\"padding: 40px 20px;\">
                <table width='100%' max-width='600' border='0' cellspacing='0' cellpadding='0' style=\"max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 0 auto; text-align: left;\">
                    <tr>
                        <td style=\"background-color: #1e3a8a; padding: 30px; text-align: center; border-bottom: 4px solid #3b82f6;\">
                            <h1 style=\"margin: 0; color: #ffffff; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;\">New Website Inquiry</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style=\"padding: 40px 30px; background-color: #ffffff;\">
                            <p style=\"color: #4b5563; font-size: 16px; margin-top: 0; margin-bottom: 30px; line-height: 1.5;\">You have received a new message from the <strong>Stellar Institute</strong> website contact form.</p>
                            
                            <div style=\"margin-bottom: 24px;\"><span style=\"display: block; font-size: 12px; text-transform: uppercase; color: #6b7280; font-weight: 700; letter-spacing: 0.8px; margin-bottom: 6px;\">Full Name</span><div style=\"font-size: 16px; color: #111827; background-color: #f9fafb; padding: 12px 16px; border-radius: 6px; border: 1px solid #e5e7eb; word-break: break-word;\">$name</div></div>
                            <div style=\"margin-bottom: 24px;\"><span style=\"display: block; font-size: 12px; text-transform: uppercase; color: #6b7280; font-weight: 700; letter-spacing: 0.8px; margin-bottom: 6px;\">Email Address</span><div style=\"font-size: 16px; color: #111827; background-color: #f9fafb; padding: 12px 16px; border-radius: 6px; border: 1px solid #e5e7eb; word-break: break-word;\"><a href='mailto:$email' style=\"color: #2563eb; text-decoration: none;\">$email</a></div></div>
                            <div style=\"margin-bottom: 24px;\"><span style=\"display: block; font-size: 12px; text-transform: uppercase; color: #6b7280; font-weight: 700; letter-spacing: 0.8px; margin-bottom: 6px;\">Phone Number</span><div style=\"font-size: 16px; color: #111827; background-color: #f9fafb; padding: 12px 16px; border-radius: 6px; border: 1px solid #e5e7eb; word-break: break-word;\">$phone</div></div>
                            <div style=\"margin-bottom: 24px;\"><span style=\"display: block; font-size: 12px; text-transform: uppercase; color: #6b7280; font-weight: 700; letter-spacing: 0.8px; margin-bottom: 6px;\">Subject</span><div style=\"font-size: 16px; color: #111827; background-color: #f9fafb; padding: 12px 16px; border-radius: 6px; border: 1px solid #e5e7eb; word-break: break-word;\"><strong>$subjectLabel</strong></div></div>
                            <div style=\"margin-bottom: 24px;\"><span style=\"display: block; font-size: 12px; text-transform: uppercase; color: #6b7280; font-weight: 700; letter-spacing: 0.8px; margin-bottom: 6px;\">Message</span><div style=\"font-size: 15px; color: #1f2937; background-color: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; line-height: 1.6; white-space: pre-wrap;\">$message</div></div>
                        </td>
                    </tr>
                    <tr>
                        <td style=\"background-color: #f9fafb; text-align: center; padding: 24px; color: #9ca3af; font-size: 13px; border-top: 1px solid #e5e7eb;\">
                            <p style=\"margin: 0; margin-bottom: 5px;\">This is an automated email from the Stellar Institute website.</p>
                            <p style=\"margin: 0;\">&copy; " . date('Y') . " Stellar Institute. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
";

// Email headers
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: Stellar Academy <noreply@stellarinstitute.pk>\r\n";
$headers .= "Reply-To: $name <$email>\r\n";

// Send the email
$sent = mail($to, $emailSubject, $emailBody, $headers, "-fnoreply@stellarinstitute.pk");

if ($sent) {
    echo json_encode(['success' => true, 'message' => 'Email sent successfully']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to send email. Please try again later.']);
}
