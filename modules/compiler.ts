import { Request, Response } from "express";

import { UserChoices } from "../types/userChoices";
import { PackingList } from "../types/packingList";
import { PackingList as DbPackingList } from "../types/db/types";
import {
  findBasicsPackingListWithItems,
  findPackingListsWithItemsById,
} from "../db/PackingListRepository";

export async function compileListFromSelections(req: Request, res: Response) {
  try {
    const packingList: PackingList = new PackingList(
      await findBasicsPackingListWithItems()
    );

    const choices: UserChoices = req.body;
    let packingListIds: string[] = [];
    packingListIds = packingListIds.concat(choices.accomodation);
    packingListIds = packingListIds.concat(choices.activities);
    packingListIds.push(choices.transport);
    packingListIds.push(choices.triptype);
    packingListIds = packingListIds.concat(choices.weather);

    packingListIds = packingListIds.filter((list) => !!list);

    const chosenPackingLists: Awaited<DbPackingList[]> =
      await findPackingListsWithItemsById(packingListIds);

    const weatherChoiceKeys: string[] = chosenPackingLists
      .filter((list) => list.type === "weather")
      .map((list) => list.name);

    chosenPackingLists.forEach((list) => {
      const internalObject: PackingList = new PackingList(list);
      packingList.addPackingList(internalObject, weatherChoiceKeys);
    });

    const tripstartDate = new Date(choices.tripstart);
    const tripendDate = new Date(choices.tripend);
    // +1 for start day
    const diffDays =
      1 +
      Math.round(
        Math.abs(
          (tripstartDate.getTime() - tripendDate.getTime()) /
            (24 * 60 * 60 * 1000)
        )
      );

    packingList.filterForExclusions(diffDays, tripstartDate, choices.isAbroad);

    packingList.removeDuplicates();

    res.json(packingList);
  } catch (error) {
    console.error(error);
  }
}
