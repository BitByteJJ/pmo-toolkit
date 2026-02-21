CREATE TABLE `card_comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`card_id` varchar(64) NOT NULL,
	`user_id` int NOT NULL,
	`content` text NOT NULL,
	`created_at` bigint NOT NULL,
	`updated_at` bigint NOT NULL,
	CONSTRAINT `card_comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `collection_cards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`collection_id` int NOT NULL,
	`card_id` varchar(64) NOT NULL,
	`added_at` bigint NOT NULL,
	CONSTRAINT `collection_cards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `collection_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`collection_id` int NOT NULL,
	`user_id` int NOT NULL,
	`role` enum('owner','editor','viewer') NOT NULL DEFAULT 'viewer',
	`joined_at` bigint NOT NULL,
	CONSTRAINT `collection_members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `shared_collections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`owner_id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`is_public` boolean NOT NULL DEFAULT false,
	`share_token` varchar(64),
	`created_at` bigint NOT NULL,
	`updated_at` bigint NOT NULL,
	CONSTRAINT `shared_collections_id` PRIMARY KEY(`id`),
	CONSTRAINT `shared_collections_share_token_unique` UNIQUE(`share_token`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`open_id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`avatar` varchar(512),
	`role` enum('admin','user') NOT NULL DEFAULT 'user',
	`created_at` bigint NOT NULL,
	`updated_at` bigint NOT NULL,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_open_id_unique` UNIQUE(`open_id`)
);
--> statement-breakpoint
ALTER TABLE `card_comments` ADD CONSTRAINT `card_comments_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `collection_cards` ADD CONSTRAINT `collection_cards_collection_id_shared_collections_id_fk` FOREIGN KEY (`collection_id`) REFERENCES `shared_collections`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `collection_members` ADD CONSTRAINT `collection_members_collection_id_shared_collections_id_fk` FOREIGN KEY (`collection_id`) REFERENCES `shared_collections`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `collection_members` ADD CONSTRAINT `collection_members_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `shared_collections` ADD CONSTRAINT `shared_collections_owner_id_users_id_fk` FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_card_comments_card` ON `card_comments` (`card_id`);--> statement-breakpoint
CREATE INDEX `idx_card_comments_user` ON `card_comments` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_collection_cards_collection` ON `collection_cards` (`collection_id`);--> statement-breakpoint
CREATE INDEX `idx_collection_members_collection` ON `collection_members` (`collection_id`);--> statement-breakpoint
CREATE INDEX `idx_collection_members_user` ON `collection_members` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_shared_collections_owner` ON `shared_collections` (`owner_id`);--> statement-breakpoint
CREATE INDEX `idx_shared_collections_token` ON `shared_collections` (`share_token`);