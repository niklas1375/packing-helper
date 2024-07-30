import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";

import { UserChoices } from "../types/userChoices";
import { PackingList } from "../types/packingList";

const prisma = new PrismaClient();

async function compileListFromSelections(req: Request, res: Response) {
  try {
    const basicsDbList = await prisma.packingList.findMany({
      where: {
        type: "basics",
      },
      include: {
        packingItems: true,
      },
    });
    // there should only be one
    const packingList = new PackingList(basicsDbList[0]);

    const choices: UserChoices = req.body;
    let packingListIds: string[] = [];
    packingListIds = packingListIds.concat(choices.accomodation);
    packingListIds = packingListIds.concat(choices.activities);
    packingListIds.push(choices.transport);
    packingListIds.push(choices.triptype);
    packingListIds = packingListIds.concat(choices.weather);

    packingListIds = packingListIds.filter((list) => !!list);

    const chosenPackingLists = await prisma.packingList.findMany({
      where: {
        id: {
          in: packingListIds,
        },
      },
      include: {
        packingItems: true,
      },
    });

    const weatherChoiceKeys = chosenPackingLists
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
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      console.error(e.code, e.name, e.message);
    }
    if (e instanceof Prisma.PrismaClientValidationError) {
      // The .code property can be accessed in a type-safe manner
      console.error(e.name, e.message);
    }
    throw e;
  }
}

export { compileListFromSelections };
