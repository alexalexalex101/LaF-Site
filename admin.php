<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


$conn = new mysqli("localhost", "root", "", "lost_and_found");
if ($conn->connect_error) die("Connection failed: " . $conn->connect_error);


// Handle actions
if (isset($_POST['action'], $_POST['id'])) {
   $id = (int)$_POST['id'];
   $action = $_POST['action'];


   if ($action === 'approve') {
       $stmt = $conn->prepare("UPDATE lost_items SET status='approved' WHERE id=?");
       $stmt->bind_param("i", $id);
       $stmt->execute();
       $stmt->close();
   } elseif ($action === 'reject' || $action === 'remove') {
       $stmt = $conn->prepare("DELETE FROM lost_items WHERE id=?");
       $stmt->bind_param("i", $id);
       $stmt->execute();
       $stmt->close();
    } elseif ($action === 'save') {
        $description = $_POST['description'] ?? '';
        $location    = $_POST['location']    ?? 'Not specified';
        $item_type   = $_POST['item_type']   ?? 'Unknown';

        $stmt = $conn->prepare("
            UPDATE lost_items 
            SET description = ?, 
                location    = ?, 
                item_type   = ?
            WHERE id = ?
        ");

        $stmt->bind_param("sssi", $description, $location, $item_type, $id);

        if ($stmt->execute()) {
            // Optional: log success
        } else {
            // You can log error here if you want
            error_log("Save failed: " . $stmt->error);
        }

        $stmt->close();
    }
}


// Fetch items
$incoming = $conn->query("SELECT * FROM lost_items WHERE status='pending' ORDER BY id DESC");
$existing = $conn->query("SELECT * FROM lost_items WHERE status='approved' ORDER BY id DESC");
?>


<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Admin Panel - Lost and Found</title>
<link rel="stylesheet" href="styles.css">

</head>
<body>
<div class="container">
<header>
   <div class="logo-container">
       <a href="index.html"><img src="images/pctvslogo.png" alt="PCTVS Logo" class="logo"></a>
   </div>
</header>


<main>
<div class="top-bar">
    <h1>Admin Panel</h1>

    <div>
    <select id="modeSelect">
        <option value="incoming">Incoming Reports</option>
        <option value="existing">Existing Items</option>
    </select>
    <button id="refreshBtn" class="refresh-button">↻ Refresh List</button>  <!-- ← NEW -->
    </div>
</div>

<p id="help-text"></p>

<div class="admin-container">
    <div class="admin-list" id="itemList">
        <?php if ($incoming->num_rows === 0 && $existing->num_rows === 0): ?>
            <div class="admin-list-empty">No items to display</div>
        <?php else: ?>
            <!-- Incoming (pending) reports -->
            <?php while ($item = $incoming->fetch_assoc()): ?>
                <div class="admin-list-item" 
                    data-mode="incoming" 
                    data-id="<?= $item['id'] ?>" 
                    data-photo="<?= htmlspecialchars($item['photo'] ?? '') ?>" 
                    data-type="<?= htmlspecialchars($item['item_type'] ?? 'Unknown') ?>" 
                    data-desc="<?= htmlspecialchars($item['description'] ?? '') ?>"
                    data-location="<?= htmlspecialchars($item['location'] ?? 'Not specified') ?>"
                    data-date-found="<?= htmlspecialchars($item['date_found'] ?? 'Not specified') ?>"
                    data-created-at="<?= htmlspecialchars($item['created_at'] ?? 'Not specified') ?>">
                    Report #<?= $item['id'] ?>
                </div>
            <?php endwhile; ?>

            <!-- Existing (approved) items -->
            <?php while ($item = $existing->fetch_assoc()): ?>
                <div class="admin-list-item" 
                    data-mode="existing" 
                    data-id="<?= $item['id'] ?>" 
                    data-photo="<?= htmlspecialchars($item['photo'] ?? '') ?>" 
                    data-type="<?= htmlspecialchars($item['item_type'] ?? 'Unknown') ?>" 
                    data-desc="<?= htmlspecialchars($item['description'] ?? '') ?>"
                    data-location="<?= htmlspecialchars($item['location'] ?? 'Not specified') ?>"
                    data-date-found="<?= htmlspecialchars($item['date_found'] ?? 'Not specified') ?>"
                    data-created-at="<?= htmlspecialchars($item['created_at'] ?? 'Not specified') ?>"
                    style="display: none;">
                    Report #<?= $item['id'] ?>
                </div>
            <?php endwhile; ?>
        <?php endif; ?>
    </div>

    <div class="admin-detail" id="itemDetail">
        
        <h2 id="detailReportId">Report #</h2>
<div id="flexcolumn">
    <div>
        <img id="detailPhoto" src="images/boxlogo.png" alt="Item Photo">
    </div>
        <!-- Location -->

    <div id="flexcolumndiv">
        <div>
            <strong>Location:</strong>
                <select id="detailLocationSelect">
                    <option value="">Not specified</option>
                    <option value="Main Building Lost & Found">Main Building Lost & Found</option>
                    <option value="Main Gym Locker Room Lost & Found">Main Gym Locker Room Lost & Found</option>
                    <option value="Athletic Center Lost & Found">Athletic Center Lost & Found</option>
                    <option value="Rocco Building Lost & Found">Rocco Building Lost & Found</option>
                    <option value="Stem Building Lost & Found">Stem Building Lost & Found</option>
                    <option value="Stem Gym Locker Room Lost & Found">Stem Gym Locker Room Lost & Found</option>
                </select>
        </div>

        <!-- Item Type -->
        <div>
            <strong>Type:</strong>
            <select id="detailTypeSelect">
                <option value="">Unknown</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing / Accessories</option>
                <option value="keys">Keys / Wallet / ID</option>
                <option value="bag">Bag / Backpack</option>
                <option value="jewelry">Jewelry / Watch</option>
                <option value="documents">Documents / Books</option>
                <option value="other">Other</option>
            </select>
        </div>

        <!-- Date Found -->
        <div>
            <strong>Date Found:</strong>
            <span id="detailDateFound">Not selected</span>
        </div>

        <!-- Created At -->
        <div>
            <strong>Created At:</strong>
            <span id="detailCreatedAt">Not selected</span>
        </div>
</div>
</div>
        <!-- Description -->
        <strong>Description:</strong>  
        <div>
            <textarea id="detailDesc" readonly></textarea>
        </div>

        <form id="actionForm" method="POST">
            <input type="hidden" name="id" id="formId">
            <input type="hidden" name="action" id="formAction">
            <div class="actions">
                <button type="button" class="approve" id="btnApprove">Approve</button>
                <button type="button" class="reject" id="btnReject">Reject</button>
                <button type="button" class="save" id="btnSave">Save</button>
                <button type="button" class="remove" id="btnRemove">Remove</button>
            </div>
        </form>
    </div>
</div>
</main>
</div>

<script src="admin.js"></script>


</body>
</html>


<?php $conn->close(); ?>


