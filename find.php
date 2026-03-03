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
                <div class="layout">

                    <aside class="filters">
                        <button class="reset-btn" id="resetFilters">Reset Filters</button>

                        <!-- Filter by Type -->
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

                        <!-- Container for active filter chips -->
                        <div id="activeFilters" class="active-filters"></div>
                    </aside>

                    <!-- Right content -->
                    <section class="results">

                        <!-- Search -->
                        <div class="search-bar">
                            <input type="text" id="searchInput" placeholder="Search through reports...">
                            <button class="search-btn">
                                <svg viewBox="0 0 24 24" class="search-icon">
                                    <circle cx="11" cy="11" r="7"></circle>
                                    <line x1="16.65" y1="16.65" x2="21" y2="21"></line>
                                </svg>
                            </button>
                        </div>

                        <!-- Cards -->
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

                                    echo '
                                    <div class="item-card">
                                        <img src="' . $photoPath . '" 
                                            alt="' . $itemType . '" 
                                            class="clickable-image"
                                            data-id="' . $row['id'] . '"
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
        </main>
    </div>
    <!-- Quarter-circle corner label -->
    <a href="report.php">
        <div class="corner-quarter">
            <div class="corner-text">
                Report a<br>Lost Item
            </div>
        </div>
    </a>
    </main>
    </div>

    <script src="find.js">
    </script>
                        <div id="itemModal" class="modal">
                            <div class="modal-content">
                                <span class="close-modal">×</span>

                                <h2>Item Inquiry</h2>

                                <div class="modal-layout">
                                    <!-- Left: Image -->
                                    <div class="modal-image">
                                        <img id="modalImage" src="" alt="Lost Item">
                                    </div>

                                    <!-- Right: Inquiry Form -->
                                    <div class="inquiry-form">
                                        <p>Is this your item?<br>Submit an inquiry form for more information!</p>

                                        <label for="inquiryEmail">Enter Email Address</label>
                                        <input type="email" id="inquiryEmail" placeholder="your@email.com" required>

                                        <button id="inquirySubmit" class="submit-button">Submit</button>

                                        <!-- Fake success message -->
                                        <div id="inquirySuccess" class="success-msg" style="display:none;">
                                            Inquiry sent! We'll contact you soon.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
</body>

</html>