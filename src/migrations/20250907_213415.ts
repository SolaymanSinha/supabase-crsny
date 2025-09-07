import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_contact_us_contact_info_business_hours_day" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
  CREATE TABLE "pages_about_us_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_title" varchar NOT NULL,
  	"section_content" jsonb NOT NULL,
  	"section_image_id" integer
  );
  
  CREATE TABLE "pages_about_us_team" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"position" varchar NOT NULL,
  	"bio" varchar,
  	"image_id" integer,
  	"social_links_linkedin" varchar,
  	"social_links_twitter" varchar,
  	"social_links_email" varchar
  );
  
  CREATE TABLE "pages_contact_us_contact_info_business_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day" "enum_pages_contact_us_contact_info_business_hours_day" NOT NULL,
  	"hours" varchar NOT NULL,
  	"closed" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_faqs_categories_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" jsonb NOT NULL,
  	"featured" boolean DEFAULT false,
  	"order" numeric DEFAULT 0
  );
  
  CREATE TABLE "pages_faqs_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"category_name" varchar NOT NULL,
  	"category_description" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"about_us_enabled" boolean DEFAULT true,
  	"about_us_title" varchar DEFAULT 'About Us' NOT NULL,
  	"about_us_subtitle" varchar,
  	"about_us_hero_image_id" integer,
  	"about_us_content" jsonb NOT NULL,
  	"about_us_seo_meta_title" varchar,
  	"about_us_seo_meta_description" varchar,
  	"contact_us_enabled" boolean DEFAULT true,
  	"contact_us_title" varchar DEFAULT 'Contact Us' NOT NULL,
  	"contact_us_subtitle" varchar,
  	"contact_us_description" jsonb,
  	"contact_us_contact_info_address_street" varchar,
  	"contact_us_contact_info_address_city" varchar,
  	"contact_us_contact_info_address_state" varchar,
  	"contact_us_contact_info_address_postal_code" varchar,
  	"contact_us_contact_info_address_country" varchar,
  	"contact_us_contact_info_phone" varchar,
  	"contact_us_contact_info_email" varchar,
  	"contact_us_contact_form_enabled" boolean DEFAULT true,
  	"contact_us_contact_form_form_title" varchar DEFAULT 'Get in Touch',
  	"contact_us_contact_form_form_description" varchar,
  	"contact_us_contact_form_recipient_email" varchar NOT NULL,
  	"contact_us_contact_form_success_message" varchar DEFAULT 'Thank you for your message. We will get back to you soon!',
  	"contact_us_map_enabled" boolean DEFAULT false,
  	"contact_us_map_embed_url" varchar,
  	"contact_us_seo_meta_title" varchar,
  	"contact_us_seo_meta_description" varchar,
  	"faqs_enabled" boolean DEFAULT true,
  	"faqs_title" varchar DEFAULT 'Frequently Asked Questions' NOT NULL,
  	"faqs_subtitle" varchar,
  	"faqs_description" jsonb,
  	"faqs_contact_c_t_a_enabled" boolean DEFAULT true,
  	"faqs_contact_c_t_a_title" varchar DEFAULT 'Didn''t find what you''re looking for?',
  	"faqs_contact_c_t_a_description" varchar DEFAULT 'Contact our support team for personalized assistance.',
  	"faqs_contact_c_t_a_button_text" varchar DEFAULT 'Contact Support',
  	"faqs_contact_c_t_a_button_link" varchar DEFAULT '/contact',
  	"faqs_seo_meta_title" varchar,
  	"faqs_seo_meta_description" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "pages_about_us_sections" ADD CONSTRAINT "pages_about_us_sections_section_image_id_media_id_fk" FOREIGN KEY ("section_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_about_us_sections" ADD CONSTRAINT "pages_about_us_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_about_us_team" ADD CONSTRAINT "pages_about_us_team_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_about_us_team" ADD CONSTRAINT "pages_about_us_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_contact_us_contact_info_business_hours" ADD CONSTRAINT "pages_contact_us_contact_info_business_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_faqs_categories_questions" ADD CONSTRAINT "pages_faqs_categories_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_faqs_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_faqs_categories" ADD CONSTRAINT "pages_faqs_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_about_us_hero_image_id_media_id_fk" FOREIGN KEY ("about_us_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_about_us_sections_order_idx" ON "pages_about_us_sections" USING btree ("_order");
  CREATE INDEX "pages_about_us_sections_parent_id_idx" ON "pages_about_us_sections" USING btree ("_parent_id");
  CREATE INDEX "pages_about_us_sections_section_image_idx" ON "pages_about_us_sections" USING btree ("section_image_id");
  CREATE INDEX "pages_about_us_team_order_idx" ON "pages_about_us_team" USING btree ("_order");
  CREATE INDEX "pages_about_us_team_parent_id_idx" ON "pages_about_us_team" USING btree ("_parent_id");
  CREATE INDEX "pages_about_us_team_image_idx" ON "pages_about_us_team" USING btree ("image_id");
  CREATE INDEX "pages_contact_us_contact_info_business_hours_order_idx" ON "pages_contact_us_contact_info_business_hours" USING btree ("_order");
  CREATE INDEX "pages_contact_us_contact_info_business_hours_parent_id_idx" ON "pages_contact_us_contact_info_business_hours" USING btree ("_parent_id");
  CREATE INDEX "pages_faqs_categories_questions_order_idx" ON "pages_faqs_categories_questions" USING btree ("_order");
  CREATE INDEX "pages_faqs_categories_questions_parent_id_idx" ON "pages_faqs_categories_questions" USING btree ("_parent_id");
  CREATE INDEX "pages_faqs_categories_order_idx" ON "pages_faqs_categories" USING btree ("_order");
  CREATE INDEX "pages_faqs_categories_parent_id_idx" ON "pages_faqs_categories" USING btree ("_parent_id");
  CREATE INDEX "pages_about_us_about_us_hero_image_idx" ON "pages" USING btree ("about_us_hero_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_about_us_sections" CASCADE;
  DROP TABLE "pages_about_us_team" CASCADE;
  DROP TABLE "pages_contact_us_contact_info_business_hours" CASCADE;
  DROP TABLE "pages_faqs_categories_questions" CASCADE;
  DROP TABLE "pages_faqs_categories" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TYPE "public"."enum_pages_contact_us_contact_info_business_hours_day";`)
}
