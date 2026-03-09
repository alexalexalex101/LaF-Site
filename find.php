<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PCTVS Lost and Found - Find a Lost Item</title>
    <link rel="stylesheet" href="styles.css">
</head>

<body>
    <div class="container">
        <header>
            <div class="logo-container">
                <a href="index.html">
                    <img src="images/pctvslogo.png" alt="PCTVS Lost and Found Logo" class="logo">
                </a>
            </div>
        </header>

        <main>
            <div class="search-card">
                <h1 class="visually-hidden">Find a Lost Item</h1>
                <div class="layout">
                    <aside class="filters">
                        <button type="button" class="reset-btn" id="resetFilters">Reset Filters</button>

                        <label for="typeFilter" class="visually-hidden">Filter items by type</label>
                        <select id="typeFilter" class="type-select">
                            <option value="" disabled selected>Filter by Type</option>
                            <option value="electronics">Electronics</option>
                            <option value="clothing">Clothing / Accessories</option>
                            <option value="keys">Keys / Wallet / ID</option>
                            <option value="bag">Bag / Backpack</option>
                            <option value="jewelry">Jewelry / Watch</option>
                            <option value="documents">Documents / Books</option>
                            <option value="other">Other</option>
                        </select>

                        <div id="activeFilters" class="active-filters"></div>
                    </aside>

                    <section class="results">
                        <div class="search-bar">
                            <label for="searchInput" class="visually-hidden">Search reports</label>
                            <input type="text" id="searchInput" placeholder="Search through reports...">
                            <button type="button" class="search-btn" aria-label="Search reports">
                                <span class="visually-hidden">Search</span>
                                <svg viewBox="0 0 24 24" class="search-icon" aria-hidden="true" focusable="false">
                                    <circle cx="11" cy="11" r="7"></circle>
                                    <line x1="16.65" y1="16.65" x2="21" y2="21"></line>
                                </svg>
                            </button>
                        </div>

                        <div class="results-grid">
                            <?php
                            date_default_timezone_set('America/New_York');
                            $conn = new mysqli("localhost", "root", "", "lost_and_found");
                            if (!$conn->connect_error) {
                                $result = $conn->query("SELECT id, item_type, description, photo, location, date_found, created_at FROM lost_items WHERE status = 'approved' ORDER BY id DESC");
                                while ($row = $result->fetch_assoc()) {
                                    $photoPath = $row['photo'] ? "uploads/" . htmlspecialchars($row['photo']) : "images/boxlogo.png";
                                    $itemType  = htmlspecialchars($row['item_type']);
                                    $desc      = htmlspecialchars($row['description']);
                                    $location  = htmlspecialchars($row['location']);
                                    $dateFound = htmlspecialchars($row['date_found']);
                                    $createdAt = htmlspecialchars($row['created_at']);
                                    $itemId    = (int)$row['id'];
                                    $imageAlt  = "Found " . $itemType . " item report #" . $itemId;

                                    echo '
                                    <div class="item-card">
                                        <img src="' . $photoPath . '"
                                            alt="' . htmlspecialchars($imageAlt) . '"
                                            class="clickable-image"
                                            data-id="' . $itemId . '"
                                            data-type="' . $itemType . '"
                                            data-desc="' . $desc . '"
                                            data-location="' . $location . '"
                                            data-date-found="' . $dateFound . '"
                                            data-created-at="' . $createdAt . '"
                                            data-fullphoto="' . $photoPath . '">
                                    </div>';
                                }
                            }
                            ?>
                        </div>
                    </section>
                </div>
            </div>

            <a href="report.php" class="corner-quarter" aria-label="Report a lost item">
                <span class="corner-text">
                    Report a<br>Lost Item
                </span>
            </a>
        </main>
    </div>

    <div id="itemModal" class="modal" role="dialog" aria-modal="true" aria-labelledby="itemModalTitle">
        <div class="modal-content">
            <button type="button" class="close-modal" aria-label="Close dialog">&times;</button>

            <h2 id="itemModalTitle">Item Inquiry</h2>

            <div class="modal-layout">
                <div class="modal-image">
                    <img id="modalImage" src="" alt="Selected lost item">
                </div>

                <div class="inquiry-form">
                    <p>Is this your item?<br>Submit an inquiry form for more information!</p>

                    <label for="inquiryEmail">Enter Email Address</label>
                    <input type="email" id="inquiryEmail" placeholder="your@email.com" required>

                    <button id="inquirySubmit" class="submit-button" type="button">Submit</button>

                    <div id="inquirySuccess" class="success-msg" style="display:none;">
                        Inquiry sent! We'll contact you soon.
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="find.js"></script>
</body>

</html>
