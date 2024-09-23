import { Request, Response } from "express";
import { createId } from "@paralleldrive/cuid2";
import {
  findPackingListById,
  findPackingLists,
  deletePackingList as deletePackingListOnDb,
  updatePackingList as updatePackingListOnDb,
  createPackingList,
} from "../db/PackingListRepository";
import {
  NewPackingItem,
  NewPackingList,
  PackingItemUpdate,
  PackingList,
  PackingListUpdate,
} from "../types/db/types";
import {
  createPackingItem,
  deletePackingItem,
  findPackingItemsForList,
  updatePackingItem,
} from "../db/PackingItemRepository";

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
  const packingList = await findPackingListById(req.params.listId);
  res.json(packingList);
}

// mass GET for packing list items
export async function getItemsForPackingList(req: Request, res: Response) {
  const packingItems = await findPackingItemsForList(req.params.listId);
  res.json(packingItems);
}

// creation POST for packing lists
export function createPackingListOfType(type: string) {
  return async function (req: Request, res: Response) {
    const newPackingList: NewPackingList = req.body;
    newPackingList.type = type;
    newPackingList.id = createId();
    newPackingList.updated_at = new Date();
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
  newPackingItem.listId = req.params.listId;
  newPackingItem.item_id = createId();
  newPackingItem.updated_at = new Date();
  try {
    const createdItem = await createPackingItem(newPackingItem);
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
  updateObject.updated_at = new Date();
  try {
    await updatePackingItem(updateId, updateObject);
    res.status(204);
    res.send();
  } catch (error) {
    console.error(error);
    res.status(500);
    res.send("Internal Server Error");
  }
  throw new Error("Function not implemented.");
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
