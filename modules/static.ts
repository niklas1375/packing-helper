import { Request, Response } from "express";
import { findPackingLists } from "../db/PackingListRepository";
import { PackingList } from "../types/db/types";

async function getAccomodationTypes(_: Request, res: Response) {
  const accomodations = await findPackingLists({
    type: "accomodation"
  });
  res.json(_getTypesFromJSON(accomodations));
}

async function getActivityTypes(_: Request, res: Response) {
  const activities = await findPackingLists({
    type: "activity"
  });
  res.json(_getTypesFromJSON(activities));
}

async function getTransportTypes(_: Request, res: Response) {
  const transport = await findPackingLists({
    type: "transport"
  });
  res.json(_getTypesFromJSON(transport));
}

async function getTripTypes(_: Request, res: Response) {
  const triptypes = await findPackingLists({
    type: "triptype"
  });
  res.json(_getTypesFromJSON(triptypes));
}

async function getWeatherTypes(_: Request, res: Response) {
  const weather = await findPackingLists({
    type: "weather"
  });
  res.json(_getTypesFromJSON(weather));
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

export {
  getAccomodationTypes,
  getActivityTypes,
  getTransportTypes,
  getTripTypes,
  getWeatherTypes,
};
