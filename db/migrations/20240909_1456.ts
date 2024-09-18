/*
 * migration to fill updated_at fields with now value
 */

import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db
    .updateTable("PackingList")
    .set({
      updated_at: (new Date()).toString(),
    })
    .execute();

  await db
    .updateTable("PackingItem")
    .set({
      updated_at: (new Date()).toString(),
    })
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db
    .updateTable("PackingList")
    .set({
      updated_at: null,
    })
    .execute();

  await db
    .updateTable("PackingItem")
    .set({
      updated_at: null,
    })
    .execute();
}
