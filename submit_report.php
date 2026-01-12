<?php
session_start();
date_default_timezone_set('America/New_York');

// Create uploads folder if needed
$uploadDir = __DIR__ . '/uploads/';
if (!is_dir($uploadDir) && !mkdir($uploadDir, 0755, true)) {
    $_SESSION['form_status'] = 'error';
    $_SESSION['form_message'] = 'Cannot create uploads folder';
    header("Location: report.php");
    exit;
}

$conn = new mysqli("localhost", "root", "", "lost_and_found");

if ($conn->connect_error) {
    $_SESSION['form_status'] = 'error';
    $_SESSION['form_message'] = 'Database connection failed';
    header("Location: report.php");
    exit;
}

// Get form data
$item_type   = trim($_POST['item_type'] ?? '');
$description = trim($_POST['description'] ?? '');
$location    = trim($_POST['location'] ?? '');
$date_found  = trim($_POST['date_found'] ?? '');

// Use today's date if user didn't provide one (backup)
if (empty($date_found)) {
    $date_found = date('Y-m-d');
}

// Validate date format (optional safety)
if (!preg_match("/^\d{4}-\d{2}-\d{2}$/", $date_found)) {
    $_SESSION['form_status'] = 'error';
    $_SESSION['form_message'] = 'Invalid date format for Date Found.';
    header("Location: report.php");
    exit;
}

if (empty($item_type) || empty($description) || empty($location)) {
    $_SESSION['form_status'] = 'error';
    $_SESSION['form_message'] = 'All fields are required';
    header("Location: report.php");
    exit;
}

// Handle photo (optional)
$photoName = null;

if (!empty($_FILES['photo']['name']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['photo'];
    $ext  = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $allowed = ['jpg','jpeg','png','gif','webp'];

    if (!in_array($ext, $allowed)) {
        $_SESSION['form_status'] = 'error';
        $_SESSION['form_message'] = 'Only jpg, jpeg, png, gif, webp allowed';
        header("Location: report.php");
        exit;
    }

    $photoName = date('ymdHis_') . uniqid() . '.' . $ext;
    $target = $uploadDir . $photoName;

    if (!move_uploaded_file($file['tmp_name'], $target)) {
        $_SESSION['form_status'] = 'error';
        $_SESSION['form_message'] = 'Failed to save photo';
        header("Location: report.php");
        exit;
    }
}

// Save to database
$stmt = $conn->prepare(
    "INSERT INTO lost_items (item_type, description, photo, location, date_found) 
     VALUES (?, ?, ?, ?, ?)"
);

if (!$stmt) {
    $_SESSION['form_status'] = 'error';
    $_SESSION['form_message'] = 'Database error (prepare)';
    header("Location: report.php");
    exit;
}

$stmt->bind_param("sssss", $item_type, $description, $photoName, $location, $date_found);

if ($stmt->execute()) {
    $_SESSION['form_status'] = 'success';
    $_SESSION['form_message'] = 'Item reported successfully!';
} else {
    $_SESSION['form_status'] = 'error';
    $_SESSION['form_message'] = 'Error saving to database';
}

$stmt->close();
$conn->close();

header("Location: report.php");
exit;
?>