# A local MySQL database and Python will be required to run.

## IN ORDER TO HAVE MOBILE SUPPORT, FILE FOLDER MUST BE IN XAMPP HTDOCS

## To run, open XAMPP and run Apache and MySQL.

## Run emailapi.py by running python emailapi.py in the terminal. 

# Create the table below in a database called "lost_and_found"

CREATE TABLE `lost_items` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `item_type` VARCHAR(50) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `photo` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `location` VARCHAR(50) NOT NULL DEFAULT 'Main L&F',
  `date_found` DATE NOT NULL DEFAULT CURDATE(),
  `status` VARCHAR(20) DEFAULT 'pending',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `lost_items` (`id`, `item_type`, `description`, `photo`, `created_at`, `location`, `date_found`, `status`) VALUES
(47, 'other', 'A stainless steel Owala water bottle with a dark blue body, teal lid, and light blue accent ring. The lid has a flip-top spout and a black carrying loop.', '260113123136_696681788d301.webp', '2026-01-13 17:31:36', 'Main Building Lost & Found', '2025-12-11', 'approved'),
(48, 'clothing', 'A bright red The North Face puffer jacket with a full zipper and white logo on the chest. It appears to be lightly insulated and in good condition.', '260113123156_6966818c2e671.webp', '2026-01-13 17:31:56', 'Main Gym Locker Room Lost & Found', '2025-10-23', 'approved'),
(49, 'documents', 'A hardcover copy of \"The Black Sun\" by Jack Williamson. The cover is black with a cracked planet graphic and white text.', '260113133549_69669085bcd64.webp', '2026-01-13 18:35:49', 'Rocco Building Lost & Found', '2026-01-04', 'approved'),
(50, 'clothing', 'A black Nike zip-up hoodie with the classic swoosh logo on the chest. It has a hood and ribbed cuffs/hem, showing some light wear.', '260113140027_6966964b7e206.webp', '2026-01-13 19:00:27', 'Athletic Center Lost & Found', '2026-01-08', 'approved'),
(51, 'jewelry', 'A rose gold Kate Spade watch with a navy blue leather strap and matching navy face. The case is round with a simple, elegant design.', '260113140158_696696a6e42d6.webp', '2026-01-13 19:01:58', 'Stem Building Lost & Found', '2025-12-11', 'approved'),
(52, 'electronics', 'A closed Lenovo Chromebook Plus with a gray lid and \"Lenovo\" logo in the corner. The screen is off, reflecting the surroundings.', '260113144151_69669fffe4c12.webp', '2026-01-13 19:02:22', 'Main Building Lost & Found', '2026-01-13', 'approved'),
(54, 'keys', 'A dark brown leather bifold wallet, opened to show empty card slots and bill compartment. It appears well-used with some wear on the edges.', '260113140416_69669730042a5.webp', '2026-01-13 19:04:16', 'Rocco Building Lost & Found', '2026-01-18', 'approved');