<?php
session_start();

// Show message only once - then remove it
$message = $_SESSION['form_message'] ?? '';
$status  = $_SESSION['form_status']  ?? 'info';

unset($_SESSION['form_message']);
unset($_SESSION['form_status']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PCTVS Lost and Found - Report a Lost Item</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <header>
            <div class="logo-container">
                <a href="index.html">
                <img src="images/pctvslogo.png" alt="PCTVS Lost and Found Logo" class="logo">
                </a>             </div>
        </header>


        <main>
            <!-- New wrapper class just for this page's form card -->
            <div class="report-card">
                <h1>Report a Lost Item</h1>
<?php if ($message): ?>
    <div style="
        padding: 12px 20px;
        margin: 15px 0;
        border-radius: 6px;
        background-color: <?= $status === 'success' ? '#e8f5e9' : '#ffebee' ?>;
        color: <?= $status === 'success' ? '#1b5e20' : '#c62828' ?>;
        border: 1px solid <?= $status === 'success' ? '#a5d6a7' : '#ef9a9a' ?>;
        text-align: center;
        font-weight: 500;">
        <?= htmlspecialchars($message) ?>
    </div>
<?php endif; ?>

                <form class="report-form"
                    method="POST"
                    action="submit_report.php"
                    enctype="multipart/form-data">
                    <div class="form-field">
                        <label for="item-type">Item Type</label>
                        <select id="item-type" name="item_type" required>
                            <option value="" disabled selected>Select Item Type</option>
                            <option value="electronics">Electronics</option>
                            <option value="clothing">Clothing / Accessories</option>
                            <option value="keys">Keys / Wallet / ID</option>
                            <option value="bag">Bag / Backpack</option>
                            <option value="jewelry">Jewelry / Watch</option>
                            <option value="documents">Documents / Books</option>
                            <option value="other">Other</option>
                        </select>
                    </div>


                    <div class="form-field">
                        <label for="description">Item Description</label>
                        <textarea id="description" name="description" placeholder="Describe color, size, brand, any unique marks, where/when you lost it..." required></textarea>


                    </div>


                    <div class="form-field upload-field">
                        <label>Upload Thumbnail</label>
                        <div class="custom-file-upload">
                            <input type="file" id="thumbnail" name="photo" accept="image/*" hidden>
                            <button type="button" class="file-btn">Choose File</button>
                            <span class="file-info">No file selected</span>
                        </div>
                        <div class="image-preview" id="thumbnailPreview">
                            <span class="preview-label">Preview:</span>
                            <img id="thumbnailPreviewImg" alt="Thumbnail preview">
                        </div>                        
                    </div>


                    <button type="submit" class="submit-button">Submit Report</button>
                </form>
            </div>


<!-- Quarter-circle corner label -->
<a href="find.php">
    <div class="corner-quarter">
        <div class="corner-text">
            Find a<br>Lost Item
        </div>
    </div>
</a>
</main>
    </div>


    <script src="report.js">
       
    </script>
</body>
</html>
