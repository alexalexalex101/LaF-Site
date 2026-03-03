# A local MySQL database and Python will be required to run.

## IN ORDER TO HAVE MOBILE SUPPORT, FILE FOLDER MUST BE IN XAMPP HTDOCS

## To run, open XAMPP and run Apache and MySQL.

## Run emailapi.py by running "python emailapi.py" in the terminal. 

# Create the table below in a database called "lost_and_found"

CREATE TABLE `lost_items` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `item_type` ENUM('electronics','clothing','keys','bag','jewelry','documents','other') NOT NULL DEFAULT 'other',
  `description` TEXT DEFAULT NULL,
  `photo` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `location` ENUM('Main Building Lost & Found','Main Gym Locker Room Lost & Found','Athletic Center Lost & Found','Rocco Building Lost & Found','Stem Building Lost & Found','Stem Gym Locker Room Lost & Found') NOT NULL DEFAULT 'Main Building Lost & Found',
  `date_found` DATE NOT NULL DEFAULT CURDATE(),
  `date_returned` DATE DEFAULT NULL,
  `status` ENUM('pending','approved','returned') NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `lost_items` (`id`, `item_type`, `description`, `photo`, `created_at`, `location`, `date_found`, `status`, `date_returned`) VALUES
(47, 'bag', 'A gray and teal backpack with black straps and multiple compartments. It has a rugged design suitable for school or travel.', 'examples/bag.webp', '2026-01-13 22:31:36', 'Main Building Lost & Found', '2025-12-11', 'approved', NULL),
(48, 'documents', 'A hardcover copy of "The Black Sun" by Jack Williamson. The cover is black with a cracked planet graphic and white text.', 'examples/book.webp', '2026-01-13 23:35:49', 'Rocco Building Lost & Found', '2026-01-04', 'approved', NULL),
(49, 'electronics', 'A closed Lenovo Chromebook Plus with a gray lid and "Lenovo" logo in the corner. The screen is off, reflecting the surroundings.', 'examples/chromebook.webp', '2026-01-14 00:02:22', 'Main Building Lost & Found', '2026-01-13', 'approved', NULL),
(50, 'clothing', 'A bright red The North Face puffer jacket with a full zipper and white logo on the chest. It appears to be lightly insulated and in good condition.', 'examples/coat.webp', '2026-01-13 22:31:56', 'Main Gym Locker Room Lost & Found', '2025-10-23', 'approved', NULL),
(51, 'jewelry', 'A silver ring with "Love" engraved in cursive and decorative patterns around the band.', 'examples/ring.webp', '2026-01-14 00:01:58', 'Stem Building Lost & Found', '2025-12-11', 'approved', NULL),
(52, 'clothing', 'A black Nike zip-up hoodie with the classic swoosh logo on the chest. It has a hood and ribbed cuffs/hem, showing some light wear.', 'examples/sweater.webp', '2026-01-14 00:00:27', 'Athletic Center Lost & Found', '2026-01-08', 'approved', NULL),
(53, 'electronics', 'A black tablet (likely iPad or similar) with a dark screen reflection, no visible case or damage.', 'examples/tablet.webp', '2026-01-15 14:30:12', 'Stem Building Lost & Found', '2026-01-12', 'approved', NULL),
(54, 'other', 'A bright yellow tennis ball with "DIADEN" branding, slightly worn from use.', 'examples/tennis ball.webp', '2026-01-15 11:20:45', 'Main Gym Locker Room Lost & Found', '2026-01-09', 'approved', NULL),
(55, 'keys', 'A dark brown leather bifold wallet, opened to show empty card slots and bill compartment. It appears well-used with some wear on the edges.', 'examples/wallet.webp', '2026-01-14 00:04:16', 'Rocco Building Lost & Found', '2026-01-18', 'approved', NULL),
(56, 'jewelry', 'A rose gold Kate Spade watch with a navy blue leather strap and matching navy face. The case is round with a simple, elegant design.', 'examples/watch.webp', '2026-01-14 00:01:58', 'Stem Building Lost & Found', '2025-12-11', 'approved', NULL),
(57, 'other', 'A stainless steel Owala water bottle with a dark blue body, teal lid, and light blue accent ring. The lid has a flip-top spout and a black carrying loop.', 'examples/waterbottle.webp', '2026-01-13 22:31:36', 'Main Building Lost & Found', '2025-12-11', 'approved', NULL);