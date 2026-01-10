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

                    <!-- Left filters -->
                    <aside class="filters">
                        <button class="reset-btn">Reset Filters</button>

                        <select>
                            <option>Category</option>
                        </select>

                        <select>
                            <option>Color</option>
                        </select>

                        <select>
                            <option>Location</option>
                        </select>
                    </aside>

                    <!-- Right content -->
                    <section class="results">

                        <!-- Search -->
                        <div class="search-bar">
                            <input type="text" placeholder="Search through reports...">
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
                            $conn = new mysqli("localhost", "root", "", "lost_and_found");
                            if (!$conn->connect_error) {
                                $result = $conn->query("SELECT id, item_type, description, photo FROM lost_items ORDER BY id DESC");

                                if ($result->num_rows > 0) {
                                    while ($row = $result->fetch_assoc()) {
                                        $photoPath = $row['photo'] ? "uploads/" . htmlspecialchars($row['photo']) : "images/boxlogo.png";
                                        $itemType  = htmlspecialchars($row['item_type']);
                                        $desc      = htmlspecialchars($row['description']);

                                        echo '
                                        <div class="item-card">
                                            <img src="' . $photoPath . '" 
                                                alt="' . $itemType . '" 
                                                class="clickable-image"
                                                data-id="' . $row['id'] . '"
                                                data-type="' . $itemType . '"
                                                data-desc="' . $desc . '"
                                                data-fullphoto="' . $photoPath . '">
                                        </div>';
                                    }
                                } else {
                                    echo '<p style="color:white; text-align:center; grid-column: 1 / -1;">No items found.</p>';
                                }
                                $conn->close();
                            }
                            ?>
                        </div>

                <!-- Modal structure (add at bottom of body, before </body>) -->
                <!-- Original Modal with Inquiry Form inserted -->
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
                                <p>Is this your item?<br>Submit an inquiry form!</p>

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
</body>
</html>