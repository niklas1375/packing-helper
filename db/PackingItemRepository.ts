import {
  NewPackingItem,
  PackingItem,
  PackingItemUpdate,
} from "../types/db/types";
import { db } from "./database";

export async function findPackingItemById(item_id: string) {
  return await db
    .selectFrom("PackingItem")
    .where("item_id", "=", item_id)
    .selectAll()
    .executeTakeFirst();
}

export async function findPackingItem(criteria: Partial<PackingItem>) {
  let query = db.selectFrom("PackingItem");

  if (criteria.item_id) {
    query = query.where("item_id", "=", criteria.item_id);
  }

  if (criteria.name) {
    query = query.where("name", "=", criteria.name);
  }

  if (criteria.category) {
    query = query.where("category", "=", criteria.category);
  }

  return query.selectAll().execute();
}

export async function findPackingItemsForList(listId: string) {
  return await db
    .selectFrom("PackingItem")
    .where("listId", "=", listId)
    .selectAll()
    .execute();
}

export async function updatePackingItem(
  item_id: string,
  updateWith: PackingItemUpdate
) {
  return await db
    .updateTable("PackingItem")
    .set(updateWith)
    .where("item_id", "=", item_id)
    .execute();
}

export async function createPackingItem(packingItem: NewPackingItem) {
  return await db
    .insertInto("PackingItem")
    .values(packingItem)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function deletePackingItem(item_id: string) {
  return await db
    .deleteFrom("PackingItem")
    .where("item_id", "=", item_id)
    .returningAll()
    .executeTakeFirst();
}
