<?php
session_start();

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
$item_type   = trim($_POST['item_type']   ?? '');
$description = trim($_POST['description'] ?? '');

if (empty($item_type) || empty($description)) {
    $_SESSION['form_status'] = 'error';
    $_SESSION['form_message'] = 'Item type and description are required';
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
    "INSERT INTO lost_items (item_type, description, photo) VALUES (?, ?, ?)"
);

if (!$stmt) {
    $_SESSION['form_status'] = 'error';
    $_SESSION['form_message'] = 'Database error (prepare)';
    header("Location: report.php");
    exit;
}

$stmt->bind_param("sss", $item_type, $description, $photoName);

if ($stmt->execute()) {
    $_SESSION['form_status'] = 'success';
    $_SESSION['form_message'] = 'Item reported successfully!';
} else {
    $_SESSION['form_status'] = 'error';
    $_SESSION['form_message'] = 'Error saving to database';
}

$stmt->close();
$conn->close();

// Always go back to form page
header("Location: report.php");
exit;