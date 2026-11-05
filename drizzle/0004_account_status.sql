ALTER TABLE `users` ADD COLUMN `account_status` enum('active','suspended','cancelled') NOT NULL DEFAULT 'active';
