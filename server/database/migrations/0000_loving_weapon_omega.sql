CREATE TABLE `chunks` (
	`id` text PRIMARY KEY NOT NULL,
	`post_record_id` integer NOT NULL,
	`content` text NOT NULL,
	`embedding` text,
	`headers` text,
	`hash` text,
	FOREIGN KEY (`post_record_id`) REFERENCES `post_records`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `hash_index` ON `chunks` (`hash`);--> statement-breakpoint
CREATE TABLE `post_records` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`published_at` integer NOT NULL,
	`modified_at` integer,
	`scrapped_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `post_records_slug_unique` ON `post_records` (`slug`);