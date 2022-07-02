import { Request, Response } from 'express'
import accomodations from '../content/accomodation/index.json'
import activities from '../content/activities/index.json'
import transport from '../content/transport/index.json'
import triptypes from '../content/types/index.json'
import weather from '../content/weather/index.json'
import { ContentType } from '../types/contentType';

function getAccomodationTypes(_: Request, res: Response) {
    res.json(_getTypesFromJSON(accomodations))
}

function getActivityTypes(_: Request, res: Response) {
    res.json(_getTypesFromJSON(activities));
}

function getTransportTypes(_: Request, res: Response) {
    res.json(_getTypesFromJSON(transport));
}

function getTripTypes(_: Request, res: Response) {
    res.json(_getTypesFromJSON(triptypes));
}

function getWeatherTypes(_: Request, res: Response) {
    res.json(_getTypesFromJSON(weather));
}

function _getTypesFromJSON(typesJSON: ContentType[]) {
    return typesJSON.map(typeJSON => {
        return {
            "key": typeJSON.key,
            "name": typeJSON.name
        }
    })
}

export {
    getAccomodationTypes,
    getActivityTypes,
    getTransportTypes,
    getTripTypes,
    getWeatherTypes,
}