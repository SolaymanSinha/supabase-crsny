import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "orders" ADD COLUMN "payment_intent_id" varchar;
  ALTER TABLE "orders" ADD COLUMN "payment_email" varchar;
  ALTER TABLE "orders" ADD COLUMN "stripe_customer_id" varchar;
  ALTER TABLE "orders" ADD COLUMN "payment_method" varchar;
  ALTER TABLE "orders" ADD COLUMN "paid_at" timestamp(3) with time zone;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "orders" DROP COLUMN "payment_intent_id";
  ALTER TABLE "orders" DROP COLUMN "payment_email";
  ALTER TABLE "orders" DROP COLUMN "stripe_customer_id";
  ALTER TABLE "orders" DROP COLUMN "payment_method";
  ALTER TABLE "orders" DROP COLUMN "paid_at";`)
}
