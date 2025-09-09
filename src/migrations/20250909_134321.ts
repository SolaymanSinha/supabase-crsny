import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "categories" ADD COLUMN "seo_title" varchar;
  ALTER TABLE "categories" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "categories" ADD COLUMN "seo_keywords" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "categories" DROP COLUMN "seo_title";
  ALTER TABLE "categories" DROP COLUMN "seo_description";
  ALTER TABLE "categories" DROP COLUMN "seo_keywords";`)
}
