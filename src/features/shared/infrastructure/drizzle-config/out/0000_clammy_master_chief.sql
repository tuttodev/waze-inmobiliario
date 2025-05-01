CREATE TABLE "houses" (
	"id" uuid PRIMARY KEY NOT NULL,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"photo_url" varchar NOT NULL,
	"description" varchar NOT NULL,
	"phone" varchar NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"published_by" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interests" (
	"id" uuid PRIMARY KEY NOT NULL,
	"house_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"is_subscription_active" boolean DEFAULT false NOT NULL,
	"interest_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "houses" ADD CONSTRAINT "houses_published_by_users_id_fk" FOREIGN KEY ("published_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interests" ADD CONSTRAINT "interests_house_id_houses_id_fk" FOREIGN KEY ("house_id") REFERENCES "public"."houses"("id") ON DELETE no action ON UPDATE no action;