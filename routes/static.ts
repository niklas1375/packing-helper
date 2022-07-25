import { Router } from "express";
import { staticContent } from '../modules'

export const register = (app: Router) => {
    app.get('/accomodation', staticContent.getAccomodationTypes);
    app.get('/activities', staticContent.getActivityTypes);
    app.get('/transport', staticContent.getTransportTypes);
    app.get('/triptypes', staticContent.getTripTypes);
    app.get('/weather', staticContent.getWeatherTypes);
}