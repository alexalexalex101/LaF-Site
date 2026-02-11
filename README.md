# A local MySQL database and Python will be required to run.

## IN ORDER TO HAVE MOBILE SUPPORT, FILE FOLDER MUST BE IN XAMPP HTDOCS

## To run, open XAMPP and run Apache and MySQL.

## Run emailapi.py by running "python emailapi.py" in the terminal. 

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
