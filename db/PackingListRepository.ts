import { Expression } from "kysely";
import {
  NewPackingList,
  PackingList,
  PackingListUpdate,
} from "../types/db/types";
import { db } from "./database";
import { jsonArrayFrom } from "kysely/helpers/sqlite";

export async function findPackingListById(id: string) {
  return await db
    .selectFrom("PackingList")
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirst();
}

export async function findPackingListWithItemsById(id: string) {
  return await db
    .selectFrom("PackingList")
    .where("id", "=", id)
    .selectAll()
    .select(({ ref }) => [packingItems(ref("PackingList.id"))])
    .executeTakeFirst();
}

export async function findBasicsPackingListWithItems() {
  return await db
    .selectFrom("PackingList")
    .where("type", "=", "basics")
    .selectAll()
    .select(({ ref }) => [packingItems(ref("PackingList.id"))])
    .executeTakeFirst();
}

export async function findPackingLists(criteria: Partial<PackingList>) {
  let query = db.selectFrom("PackingList");

  if (criteria.id) {
    query = query.where("id", "=", criteria.id);
  }

  if (criteria.name) {
    query = query.where("name", "=", criteria.name);
  }

  if (criteria.type) {
    query = query.where("type", "=", criteria.type);
  }
  return query.selectAll().execute();
}

export async function findPackingListsWithItemsById(ids: string[]) {
  return db
    .selectFrom("PackingList")
    .where("id", "in", ids)
    .selectAll()
    .select(({ ref }) => [packingItems(ref("PackingList.id"))])
    .execute();
}

export async function updatePackingList(
  id: string,
  updateWith: PackingListUpdate
) {
  return await db
    .updateTable("PackingList")
    .set(updateWith)
    .where("id", "=", id)
    .execute();
}

export async function createPackingList(packingList: NewPackingList) {
  return await db
    .insertInto("PackingList")
    .values(packingList)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function deletePackingList(id: string) {
  return await db
    .deleteFrom("PackingList")
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();
}

function packingItems(listId: Expression<string>) {
  return jsonArrayFrom(
    db
      .selectFrom("PackingItem")
      .whereRef("PackingItem.listId", "=", listId)
      .select([
        "PackingItem.item_id",
        "PackingItem.listId",
        "PackingItem.name",
        "PackingItem.category",
        "PackingItem.dayMultiplier",
        "PackingItem.dayThreshold",
        "PackingItem.relevantForWeather",
        "PackingItem.onlyIfWeekday",
        "PackingItem.onlyIfAbroad",
        "PackingItem.dueShift",
        "PackingItem.afterReturn",
        "PackingItem.additionalLabels",
        "PackingItem.addTripNameToTask",
      ])
  )
    .$notNull()
    .as("packingItems");
}
