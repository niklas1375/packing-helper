import { Request, Response } from 'express'
import accomodations from '../content/accomodation.json'
import activities from '../content/activities.json'
import transport from '../content/transport.json'
import triptypes from '../content/tripType.json'
import weather from '../content/weather.json'
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