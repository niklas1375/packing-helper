import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

import accomodationsJSON from "../content/accomodation.json";
import activitiesJSON from "../content/activities.json";
import transportJSON from "../content/transport.json";
import triptypesJSON from "../content/tripType.json";
import weatherJSON from "../content/weather.json";
import basicsJSON from "../content/basics.json";
import { PackingCategory } from "../types/packingCategory";
import { IPackingList } from "../types/packingListInterface";
import { NamedPackingList } from "../types/namedPackingList";

const basics: IPackingList = Object.assign({}, basicsJSON);
const accomodation: NamedPackingList[] = accomodationsJSON;
const activity: NamedPackingList[] = activitiesJSON;
const transport: NamedPackingList[] = transportJSON;
const triptype: NamedPackingList[] = triptypesJSON;
const weather: NamedPackingList[] = weatherJSON;

function _getPrismaInputFromJSON(
  inputJSON: NamedPackingList[],
  category: string
): Prisma.PackingListCreateInput[] {
  return inputJSON.map((namedPackingList: NamedPackingList) => {
    const packingItems: any[] = [];
    const packingListContent: IPackingList = namedPackingList.content;
    const categoryKeys = Object.keys(packingListContent);
    categoryKeys.forEach((catKey: string) => {
      if (typeof packingListContent[catKey] === "function") return;
      (<PackingCategory>packingListContent[catKey]).content.forEach(
        (item: any) => {
          packingItems.push({
            name: item.name,
            category: catKey,
            dayMultiplier: item.dayMultiplier,
            dayThreshold: item.dayThreshold,
            relevantForWeather: item.relevantForWeather?.join(","),
            onlyIfWeekday: item.onlyIfWeekday,
            onlyIfAbroad: item.onlyIfAbroad,
            dueShift: item.dueShift,
            afterReturn: item.afterReturn,
            additionalLabels: item.additionalLabels?.join(","),
            addTripNameToTask: item.addTripNameToTask,
          });
        }
      );
    });

    const returnItem: Prisma.PackingListCreateInput = {
      name: namedPackingList.name,
      type: category,
      packingItems: {
        create: packingItems,
      },
    };
    return returnItem;
  });
}

let packingLists: Prisma.PackingListCreateInput[] = [];
packingLists = packingLists.concat(
  <Prisma.PackingListCreateInput[]>_getPrismaInputFromJSON(
    [
      {
        key: "basics",
        name: "Basics",
        content: basics,
      },
    ],
    "basics"
  )
);
packingLists = packingLists.concat(
  _getPrismaInputFromJSON(accomodation, "accomodation")
);
packingLists = packingLists.concat(
  _getPrismaInputFromJSON(activity, "activity")
);
packingLists = packingLists.concat(
  _getPrismaInputFromJSON(transport, "transport")
);
packingLists = packingLists.concat(
  _getPrismaInputFromJSON(triptype, "triptype")
);
packingLists = packingLists.concat(_getPrismaInputFromJSON(weather, "weather"));

async function main() {
  console.log(`Seeding started.`);
  packingLists.forEach(async (list) => {
    await prisma.packingList.create({
      data: list,
    });
  });
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
