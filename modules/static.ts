import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

async function getAccomodationTypes(_: Request, res: Response) {
  const accomodations = await prisma.packingList.findMany({
    where: {
      type: "accomodation"
    }
  });
  res.json(_getTypesFromJSON(accomodations));
}

async function getActivityTypes(_: Request, res: Response) {
  const activities = await prisma.packingList.findMany({
    where: {
      type: "activity"
    }
  });
  res.json(_getTypesFromJSON(activities));
}

async function getTransportTypes(_: Request, res: Response) {
  const transportTypes = await prisma.packingList.findMany({
    where: {
      type: "transport"
    }
  });
  res.json(_getTypesFromJSON(transportTypes));
}

async function getTripTypes(_: Request, res: Response) {
  const tripTypes = await prisma.packingList.findMany({
    where: {
      type: "triptype"
    }
  });
  res.json(_getTypesFromJSON(tripTypes));
}

async function getWeatherTypes(_: Request, res: Response) {
  const weathers = await prisma.packingList.findMany({
    where: {
      type: "weather"
    }
  });
  res.json(_getTypesFromJSON(weathers));
}

function _getTypesFromJSON(typesJSON: any[]) {
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
