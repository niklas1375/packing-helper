import { Request, Response } from "express";

import accomodations from "../content/accomodation.json";
import activities from "../content/activities.json";
import transport from "../content/transport.json";
import triptypes from "../content/tripType.json";
import weather from "../content/weather.json";
import basics_import from "../content/basics.json";

import { UserChoices } from "../types/userChoices";
import { PackingList } from "../types/packingList";
import { IPackingList } from "../types/packingListInterface";
import { ContentType } from "../types/contentType";

function compileListFromSelections(req: Request, res: Response) {
  const packingList = new PackingList();

  const basics: IPackingList = Object.assign({}, basics_import);
  packingList.addPackingList(basics);

  const accomodationsList: ContentType[] = accomodations;
  const activitiesList: ContentType[] = activities;
  const transportList: ContentType[] = transport;
  const triptypesList: ContentType[] = triptypes;
  const weatherList: ContentType[] = weather;

  const choices: UserChoices = req.body;

  const accChoice = accomodationsList.filter((entry) =>
    choices.accomodation?.includes(entry.key)
  );
  const actChoices = activitiesList.filter((entry) =>
    choices.activities?.includes(entry.key)
  );
  const transportChoice = transportList.find(
    (entry) => entry.key === choices.transport
  );
  const tripChoice = triptypesList.find(
    (entry) => entry.key === choices.triptype
  );
  const weatherSelection = weatherList.filter((entry) =>
    choices.weather?.includes(entry.key)
  );
  const weatherChoiceKeys = weatherSelection.map(weatherSel => weatherSel.key);

  [transportChoice, tripChoice].forEach((choice) => {
    if (!choice) return;
    packingList.addPackingList(choice!.content);
  });

  [accChoice, actChoices, weatherSelection].forEach((list) =>
    list.forEach((choice) => {
      packingList.addPackingList(choice.content, weatherChoiceKeys);
    })
  );

  packingList.removeDuplicates();

  res.json(packingList);
}

export { compileListFromSelections };
