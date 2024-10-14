import { Router } from "express";
import { staticContent } from '../modules'

export const register = (app: Router) => {
    app.get('/listtypes', staticContent.getPackingListTypes);

    // type specific routes
    app.get('/basics', staticContent.getPackingListsOfType("basics"));
    app.get('/accomodation', staticContent.getPackingListsOfType("accomodation"));
    app.post('/accomodation', staticContent.createPackingListOfType("accomodation"));
    app.get('/activities', staticContent.getPackingListsOfType("activity"));
    app.post('/activities', staticContent.createPackingListOfType("activity"));
    app.get('/transport', staticContent.getPackingListsOfType("transport"));
    app.post('/transport', staticContent.createPackingListOfType("transport"));
    app.get('/triptypes', staticContent.getPackingListsOfType("triptype"));
    app.post('/triptypes', staticContent.createPackingListOfType("triptype"));
    app.get('/weather', staticContent.getPackingListsOfType("weather"));
    app.post('/weather', staticContent.createPackingListOfType("weather"));

    // generic routes
    app.get('/packinglists/:listId', staticContent.getSinglePackingList);
    app.get('/packinglists/:listId/items', staticContent.getItemsForPackingList);
    app.post('/packinglists/:listId/items', staticContent.createPackingItemForList);
    app.patch('/packinglists/:listId', staticContent.updatePackingList);
    app.patch('/packinglists/:listId/items/:itemId', staticContent.updatePackingItemForList);
    app.delete('/packinglists/:listId', staticContent.deletePackingList);
    app.delete('/packinglists/:listId/items/:itemId', staticContent.deletePackingItemFromList);
}