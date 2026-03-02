<?php
// get_stats.php
// Returns JSON stats for the dashboard

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow from your frontend (tighten in production)

// Enable error display during development (remove or set to 0 in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Database connection (update credentials as needed)
$host = 'localhost';
$user = 'root';
$pass = '';
$dbname = 'lost_and_found';

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Database connection failed',
        'message' => $conn->connect_error
    ]);
    exit;
}

// ────────────────────────────────────────────────
// 1. Lost Items Reported Today
//    (new reports created today that are still pending)
// ────────────────────────────────────────────────
$result_lost_today = $conn->query("
    SELECT COUNT(*) as count
    FROM lost_items
    WHERE DATE(created_at) = CURDATE()
      AND status = 'pending'
");

$lost_today = $result_lost_today ? (int)$result_lost_today->fetch_assoc()['count'] : 0;

// ────────────────────────────────────────────────
// 2. Total Items Returned (cumulative)
// ────────────────────────────────────────────────
$result_returned = $conn->query("
    SELECT COUNT(*) as count
    FROM lost_items
    WHERE status = 'returned'
");

$returned = $result_returned ? (int)$result_returned->fetch_assoc()['count'] : 0;

// ────────────────────────────────────────────────
// 3. Total Pending Reports (all time)
// ────────────────────────────────────────────────
$result_pending = $conn->query("
    SELECT COUNT(*) as count
    FROM lost_items
    WHERE status = 'pending'
");

$pending = $result_pending ? (int)$result_pending->fetch_assoc()['count'] : 0;

// ────────────────────────────────────────────────
// Send JSON response
// ────────────────────────────────────────────────
echo json_encode([
    'lostToday'   => $lost_today,     // for "Lost Items Reported Today"
    'returned'    => $returned,       // for "Items Returned"
    'pending'     => $pending         // for "Pending Reports"
]);

// Clean up
$result_lost_today->free();
$result_returned->free();
$result_pending->free();
$conn->close();
?>