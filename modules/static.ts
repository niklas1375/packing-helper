import { Request, Response } from "express";
import { createId } from "@paralleldrive/cuid2";
import {
  findPackingListById,
  findPackingLists,
  deletePackingList as deletePackingListOnDb,
  updatePackingList as updatePackingListOnDb,
  createPackingList,
  findDistinctListTypes,
  findPackingListWithItemsById,
} from "../db/PackingListRepository";
import {
  NewPackingItem,
  NewPackingList,
  PackingItemUpdate,
  PackingItem as DbPackingItem,
  PackingList,
  PackingListUpdate,
} from "../types/db/types";
import {
  createPackingItem,
  deletePackingItem,
  findPackingItemById,
  findPackingItemsForList,
  updatePackingItem,
} from "../db/PackingItemRepository";
import { PackingItem } from "../types/packingItem";

// mass GET for packing lists
export function getPackingListsOfType(type: string) {
  return async function (_: Request, res: Response) {
    const packingLists = await findPackingLists({
      type: type,
    });
    res.json(_getTypesFromJSON(packingLists));
  };
}

// single GET for packing lists
export async function getSinglePackingList(req: Request, res: Response) {
  let packingList;
  if (req.query.expand === "items") {
    packingList = await findPackingListWithItemsById(req.params.listId);
  } else {
    packingList = await findPackingListById(req.params.listId);
  }
  res.json(packingList);
}

// mass GET for packing list items
export async function getItemsForPackingList(req: Request, res: Response) {
  const packingItems: DbPackingItem[] = await findPackingItemsForList(
    req.params.listId
  );
  const transformedPackingItems: PackingItem[] = packingItems.map((item) =>
    _transformPackingItemfromSqlite(item)
  );
  res.json(transformedPackingItems);
}

// creation POST for packing lists
export function createPackingListOfType(type: string) {
  return async function (req: Request, res: Response) {
    const newPackingList: NewPackingList = req.body;
    newPackingList.type = type;
    newPackingList.id = createId();
    newPackingList.updated_at = new Date().toISOString();
    try {
      const createdList = await createPackingList(newPackingList);
      res.status(201);
      res.json(createdList);
    } catch (error) {
      console.error(error);
      res.status(500);
      res.send("Internal Server Error");
    }
  };
}

// creation POST for packing list items
export async function createPackingItemForList(req: Request, res: Response) {
  const newPackingItem: NewPackingItem = req.body;
  if (!newPackingItem.name || !newPackingItem.category) {
    res.status(400);
    res.json({
      message: "The attributes name and category must be provided.",
    });
    return;
  }

  newPackingItem.listId = req.params.listId;
  newPackingItem.item_id = createId();
  newPackingItem.updated_at = new Date().toISOString();
  const sqliteObject: NewPackingItem =
    _transformNewPackingItemToSqlite(newPackingItem);
  try {
    const createdItem = await createPackingItem(sqliteObject);
    res.status(201);
    res.json(createdItem);
  } catch (error) {
    console.error(error);
    res.status(500);
    res.send("Internal Server Error");
  }
}

// update PATCH for packing list
export async function updatePackingList(req: Request, res: Response) {
  const updateId = req.params.listId;
  // name should be the only updateable property
  if (!req.body.name) {
    res.status(400);
    res.send({
      message: "only name can be updated",
    });
  }
  const updateObject: PackingListUpdate = {
    name: req.body.name,
    updated_at: new Date().toISOString(),
  };
  try {
    await updatePackingListOnDb(updateId, updateObject);
    res.status(204);
    res.send();
  } catch (error) {
    console.error(error);
    res.status(500);
    res.send("Internal Server Error");
  }
}

// update PATCH for packing list item
export async function updatePackingItemForList(req: Request, res: Response) {
  const updateId = req.params.itemId;
  const updateObject: PackingItemUpdate = req.body;
  delete updateObject.item_id;
  delete updateObject.listId;
  updateObject.updated_at = new Date().toISOString();
  const sqliteUpdateObject = _transformPackingItemUpdateToSqlite(updateObject);
  try {
    await updatePackingItem(updateId, sqliteUpdateObject);
    res.status(204);
    res.send();
  } catch (error) {
    console.error(error);
    res.status(500);
    res.send("Internal Server Error");
  }
}

// DELETE for packing list
export async function deletePackingList(req: Request, res: Response) {
  const deletionId = req.params.listId;
  try {
    await deletePackingListOnDb(deletionId);
    res.status(204);
    res.send();
  } catch (error) {
    console.error(error);
    res.status(500);
    res.send("Internal Server Error");
  }
}

// DELETE for packing list item
export async function deletePackingItemFromList(req: Request, res: Response) {
  const deletionId = req.params.itemId;
  try {
    await deletePackingItem(deletionId);
    res.status(204);
    res.send();
  } catch (error) {
    console.error(error);
    res.status(500);
    res.send("Internal Server Error");
  }
}

// GET for packing list item
export async function getSinglePackingItem(req: Request, res: Response) {
  const packingItem: DbPackingItem | undefined = await findPackingItemById(
    req.params.itemId
  );
  if (!packingItem) {
    res.status(404);
    res.send();
    return;
  }
  const newItem: PackingItem = _transformPackingItemfromSqlite(packingItem);
  res.json(newItem);
}

export async function getPackingListTypes(_: Request, res: Response) {
  try {
    const types = await findDistinctListTypes();
    res.status(200);
    res.json(types);
  } catch (error) {
    console.error(error);
    res.status(500);
    res.send("Internal Server Error");
  }
}

function _getTypesFromJSON(typesJSON: PackingList[]) {
  return typesJSON
    .map((typeJSON) => {
      return {
        key: typeJSON.id,
        name: typeJSON.name,
      };
    })
    .sort((itemA, itemB) => {
      // ignore equal names --> doesn't matter if they appear after each other as long as they're together
      return itemA.name > itemB.name ? 1 : -1;
    });
}

function _transformPackingItemUpdateToSqlite(
  input: PackingItemUpdate
): PackingItemUpdate {
  Object.keys(input).forEach((key) => {
    if (typeof (input as any)[key] === "boolean") {
      (input as any)[key] = (input as any)[key] ? 1 : 0;
    }
    if (Array.isArray((input as any)[key])) {
      (input as any)[key] = (input as any)[key].join(",");
    }
  });
  return input;
}

function _transformNewPackingItemToSqlite(
  input: NewPackingItem
): NewPackingItem {
  Object.keys(input).forEach((key) => {
    if (typeof (input as any)[key] === "boolean") {
      (input as any)[key] = (input as any)[key] ? 1 : 0;
    }
    if (Array.isArray((input as any)[key])) {
      (input as any)[key] = (input as any)[key].join(",");
    }
  });
  return input;
}

function _transformPackingItemfromSqlite(input: DbPackingItem): PackingItem {
  const newItem: PackingItem = {
    name: input.name,
    category: input.category,
  };
  if (input.relevantForWeather) {
    newItem.relevantForWeather = input.relevantForWeather.split(",");
  }
  if (input.additionalLabels) {
    newItem.additionalLabels = input.additionalLabels.split(",");
  }
  newItem.onlyIfAbroad = !!input.onlyIfAbroad;
  newItem.onlyIfWeekday = !!input.onlyIfWeekday;
  newItem.afterReturn = !!input.afterReturn;
  newItem.addTripNameToTask = !!input.addTripNameToTask;

  // unnecessary to transform
  newItem.dayMultiplier = input.dayMultiplier;
  newItem.dayThreshold = input.dayThreshold;
  newItem.dueShift = input.dueShift;
  return newItem;
}
