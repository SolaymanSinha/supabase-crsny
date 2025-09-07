import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_orders_status" AS ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
  CREATE TYPE "public"."enum_orders_payment_status" AS ENUM('pending', 'paid', 'failed', 'refunded');
  CREATE TYPE "public"."enum_company_business_info_size" AS ENUM('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"_key" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"image_id" integer,
  	"featured" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "variant_names" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "variant_values" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "products_variants_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant_name" varchar,
  	"variant_value" varchar
  );
  
  CREATE TABLE "products_variants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"price" numeric NOT NULL
  );
  
  CREATE TABLE "products_upload_fields" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"required" boolean DEFAULT false,
  	"description" varchar,
  	"max_files" numeric DEFAULT 1
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" jsonb,
  	"short_description" varchar,
  	"category_id" integer,
  	"cover_image_id" integer,
  	"base_price" numeric NOT NULL,
  	"is_active" boolean DEFAULT false,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_keywords" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "products_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "orders_items_selected_variant" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant_name" varchar NOT NULL,
  	"variant_value" varchar NOT NULL
  );
  
  CREATE TABLE "orders_items_uploaded_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field_label" varchar NOT NULL
  );
  
  CREATE TABLE "orders_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer NOT NULL,
  	"price" numeric NOT NULL,
  	"quantity" numeric NOT NULL
  );
  
  CREATE TABLE "orders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order_number" varchar NOT NULL,
  	"cart_session_id" varchar,
  	"total_items" numeric NOT NULL,
  	"total_amount" numeric NOT NULL,
  	"status" "enum_orders_status" DEFAULT 'pending' NOT NULL,
  	"customer_info_name" varchar NOT NULL,
  	"customer_info_email" varchar NOT NULL,
  	"customer_info_phone" varchar,
  	"shipping_address_street" varchar NOT NULL,
  	"shipping_address_city" varchar NOT NULL,
  	"shipping_address_state" varchar NOT NULL,
  	"shipping_address_postal_code" varchar NOT NULL,
  	"shipping_address_country" varchar NOT NULL,
  	"billing_address_same_as_shipping" boolean DEFAULT true,
  	"billing_address_street" varchar,
  	"billing_address_city" varchar,
  	"billing_address_state" varchar,
  	"billing_address_postal_code" varchar,
  	"billing_address_country" varchar,
  	"payment_status" "enum_orders_payment_status" DEFAULT 'pending' NOT NULL,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "orders_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"categories_id" integer,
  	"variant_names_id" integer,
  	"variant_values_id" integer,
  	"products_id" integer,
  	"orders_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "company" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"logo_id" integer,
  	"tagline" varchar,
  	"description" varchar,
  	"contact_info_primary_email" varchar NOT NULL,
  	"contact_info_secondary_email" varchar,
  	"contact_info_primary_phone" varchar NOT NULL,
  	"contact_info_secondary_phone" varchar,
  	"contact_info_mobile_phone" varchar,
  	"contact_info_address" varchar NOT NULL,
  	"contact_info_city" varchar,
  	"contact_info_state" varchar,
  	"contact_info_zip_code" varchar,
  	"contact_info_country" varchar,
  	"social_media_facebook" varchar,
  	"social_media_twitter" varchar,
  	"social_media_instagram" varchar,
  	"social_media_linkedin" varchar,
  	"business_info_founded" timestamp(3) with time zone,
  	"business_info_industry" varchar,
  	"business_info_size" "enum_company_business_info_size",
  	"business_info_tax_id" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_keywords" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "web_contents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_image_id" integer,
  	"top_seller_hero_id" integer,
  	"best_deals_hero_id" integer,
  	"footer_content_about_description" varchar,
  	"footer_content_free_proofs_description" varchar,
  	"footer_content_business_hours_description" varchar,
  	"footer_content_copyright" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "web_contents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer,
  	"media_id" integer
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_variants_options" ADD CONSTRAINT "products_variants_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_variants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_variants" ADD CONSTRAINT "products_variants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_upload_fields" ADD CONSTRAINT "products_upload_fields_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders_items_selected_variant" ADD CONSTRAINT "orders_items_selected_variant_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders_items_uploaded_files" ADD CONSTRAINT "orders_items_uploaded_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders_rels" ADD CONSTRAINT "orders_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders_rels" ADD CONSTRAINT "orders_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_variant_names_fk" FOREIGN KEY ("variant_names_id") REFERENCES "public"."variant_names"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_variant_values_fk" FOREIGN KEY ("variant_values_id") REFERENCES "public"."variant_values"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_orders_fk" FOREIGN KEY ("orders_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "company" ADD CONSTRAINT "company_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "web_contents" ADD CONSTRAINT "web_contents_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "web_contents" ADD CONSTRAINT "web_contents_top_seller_hero_id_media_id_fk" FOREIGN KEY ("top_seller_hero_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "web_contents" ADD CONSTRAINT "web_contents_best_deals_hero_id_media_id_fk" FOREIGN KEY ("best_deals_hero_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "web_contents_rels" ADD CONSTRAINT "web_contents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."web_contents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "web_contents_rels" ADD CONSTRAINT "web_contents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "web_contents_rels" ADD CONSTRAINT "web_contents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX "categories_name_idx" ON "categories" USING btree ("name");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_image_idx" ON "categories" USING btree ("image_id");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "variant_names_name_idx" ON "variant_names" USING btree ("name");
  CREATE INDEX "variant_names_updated_at_idx" ON "variant_names" USING btree ("updated_at");
  CREATE INDEX "variant_names_created_at_idx" ON "variant_names" USING btree ("created_at");
  CREATE UNIQUE INDEX "variant_values_value_idx" ON "variant_values" USING btree ("value");
  CREATE INDEX "variant_values_updated_at_idx" ON "variant_values" USING btree ("updated_at");
  CREATE INDEX "variant_values_created_at_idx" ON "variant_values" USING btree ("created_at");
  CREATE INDEX "products_variants_options_order_idx" ON "products_variants_options" USING btree ("_order");
  CREATE INDEX "products_variants_options_parent_id_idx" ON "products_variants_options" USING btree ("_parent_id");
  CREATE INDEX "products_variants_order_idx" ON "products_variants" USING btree ("_order");
  CREATE INDEX "products_variants_parent_id_idx" ON "products_variants" USING btree ("_parent_id");
  CREATE INDEX "products_upload_fields_order_idx" ON "products_upload_fields" USING btree ("_order");
  CREATE INDEX "products_upload_fields_parent_id_idx" ON "products_upload_fields" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");
  CREATE INDEX "products_category_idx" ON "products" USING btree ("category_id");
  CREATE INDEX "products_cover_image_idx" ON "products" USING btree ("cover_image_id");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "products_rels_order_idx" ON "products_rels" USING btree ("order");
  CREATE INDEX "products_rels_parent_idx" ON "products_rels" USING btree ("parent_id");
  CREATE INDEX "products_rels_path_idx" ON "products_rels" USING btree ("path");
  CREATE INDEX "products_rels_media_id_idx" ON "products_rels" USING btree ("media_id");
  CREATE INDEX "orders_items_selected_variant_order_idx" ON "orders_items_selected_variant" USING btree ("_order");
  CREATE INDEX "orders_items_selected_variant_parent_id_idx" ON "orders_items_selected_variant" USING btree ("_parent_id");
  CREATE INDEX "orders_items_uploaded_files_order_idx" ON "orders_items_uploaded_files" USING btree ("_order");
  CREATE INDEX "orders_items_uploaded_files_parent_id_idx" ON "orders_items_uploaded_files" USING btree ("_parent_id");
  CREATE INDEX "orders_items_order_idx" ON "orders_items" USING btree ("_order");
  CREATE INDEX "orders_items_parent_id_idx" ON "orders_items" USING btree ("_parent_id");
  CREATE INDEX "orders_items_product_idx" ON "orders_items" USING btree ("product_id");
  CREATE UNIQUE INDEX "orders_order_number_idx" ON "orders" USING btree ("order_number");
  CREATE INDEX "orders_updated_at_idx" ON "orders" USING btree ("updated_at");
  CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");
  CREATE INDEX "orders_rels_order_idx" ON "orders_rels" USING btree ("order");
  CREATE INDEX "orders_rels_parent_idx" ON "orders_rels" USING btree ("parent_id");
  CREATE INDEX "orders_rels_path_idx" ON "orders_rels" USING btree ("path");
  CREATE INDEX "orders_rels_media_id_idx" ON "orders_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_variant_names_id_idx" ON "payload_locked_documents_rels" USING btree ("variant_names_id");
  CREATE INDEX "payload_locked_documents_rels_variant_values_id_idx" ON "payload_locked_documents_rels" USING btree ("variant_values_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_orders_id_idx" ON "payload_locked_documents_rels" USING btree ("orders_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "company_logo_idx" ON "company" USING btree ("logo_id");
  CREATE INDEX "web_contents_hero_image_idx" ON "web_contents" USING btree ("hero_image_id");
  CREATE INDEX "web_contents_top_seller_hero_idx" ON "web_contents" USING btree ("top_seller_hero_id");
  CREATE INDEX "web_contents_best_deals_hero_idx" ON "web_contents" USING btree ("best_deals_hero_id");
  CREATE INDEX "web_contents_rels_order_idx" ON "web_contents_rels" USING btree ("order");
  CREATE INDEX "web_contents_rels_parent_idx" ON "web_contents_rels" USING btree ("parent_id");
  CREATE INDEX "web_contents_rels_path_idx" ON "web_contents_rels" USING btree ("path");
  CREATE INDEX "web_contents_rels_products_id_idx" ON "web_contents_rels" USING btree ("products_id");
  CREATE INDEX "web_contents_rels_media_id_idx" ON "web_contents_rels" USING btree ("media_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "variant_names" CASCADE;
  DROP TABLE "variant_values" CASCADE;
  DROP TABLE "products_variants_options" CASCADE;
  DROP TABLE "products_variants" CASCADE;
  DROP TABLE "products_upload_fields" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "products_rels" CASCADE;
  DROP TABLE "orders_items_selected_variant" CASCADE;
  DROP TABLE "orders_items_uploaded_files" CASCADE;
  DROP TABLE "orders_items" CASCADE;
  DROP TABLE "orders" CASCADE;
  DROP TABLE "orders_rels" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "company" CASCADE;
  DROP TABLE "web_contents" CASCADE;
  DROP TABLE "web_contents_rels" CASCADE;
  DROP TYPE "public"."enum_orders_status";
  DROP TYPE "public"."enum_orders_payment_status";
  DROP TYPE "public"."enum_company_business_info_size";`)
}
