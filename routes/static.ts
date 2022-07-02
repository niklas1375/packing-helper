import { Application } from "express";
import { staticContent } from '../modules'

export const register = (app: Application) => {
    app.get('/accomodation', staticContent.getAccomodationTypes);
    app.get('/activities', staticContent.getActivityTypes);
    app.get('/transport', staticContent.getTransportTypes);
    app.get('/triptypes', staticContent.getTripTypes);
    app.get('/weather', staticContent.getWeatherTypes);
}