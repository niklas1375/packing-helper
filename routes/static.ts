import { Router } from "express";
import { staticContent } from '../modules'

export const register = (app: Router) => {
    app.get('/listtypes', staticContent.getPackingListTypes);
    app.get('/accomodation', staticContent.getPackingListsOfType("accomodation"));
    app.get('/accomodation/:listId', staticContent.getSinglePackingList);
    app.get('/accomodation/:listId/items', staticContent.getItemsForPackingList);
    app.post('/accomodation', staticContent.createPackingListOfType("accomodation"));
    app.post('/accomodation/:listId/items', staticContent.createPackingItemForList);
    app.patch('/accomodation/:listId', staticContent.updatePackingList);
    app.patch('/accomodation/:listId/items/:itemId', staticContent.updatePackingItemForList);
    app.delete('/accomodation/:listId', staticContent.deletePackingList);
    app.delete('/accomodation/:listId/items/:itemId', staticContent.deletePackingItemFromList);

    // activity routes
    app.get('/activities', staticContent.getPackingListsOfType("activity"));
    app.get('/activities/:listId', staticContent.getSinglePackingList);
    app.get('/activities/:listId/items', staticContent.getItemsForPackingList);
    app.post('/activities', staticContent.createPackingListOfType("activity"));
    app.post('/activities/:listId/items', staticContent.createPackingItemForList);
    app.patch('/activities/:listId', staticContent.updatePackingList);
    app.patch('/activities/:listId/items/:itemId', staticContent.updatePackingItemForList);
    app.delete('/activities/:listId', staticContent.deletePackingList);
    app.delete('/activities/:listId/items/:itemId', staticContent.deletePackingItemFromList);

    // transport routes
    app.get('/transport', staticContent.getPackingListsOfType("transport"));
    app.get('/transport/:listId', staticContent.getSinglePackingList);
    app.get('/transport/:listId/items', staticContent.getItemsForPackingList);
    app.post('/transport', staticContent.createPackingListOfType("transport"));
    app.post('/transport/:listId/items', staticContent.createPackingItemForList);
    app.patch('/transport/:listId', staticContent.updatePackingList);
    app.patch('/transport/:listId/items/:itemId', staticContent.updatePackingItemForList);
    app.delete('/transport/:listId', staticContent.deletePackingList);
    app.delete('/transport/:listId/items/:itemId', staticContent.deletePackingItemFromList);

    // triptype routes
    app.get('/triptypes', staticContent.getPackingListsOfType("triptype"));
    app.get('/triptypes/:listId', staticContent.getSinglePackingList);
    app.get('/triptypes/:listId/items', staticContent.getItemsForPackingList);
    app.post('/triptypes', staticContent.createPackingListOfType("triptype"));
    app.post('/triptypes/:listId/items', staticContent.createPackingItemForList);
    app.patch('/triptypes/:listId', staticContent.updatePackingList);
    app.patch('/triptypes/:listId/items/:itemId', staticContent.updatePackingItemForList);
    app.delete('/triptypes/:listId', staticContent.deletePackingList);
    app.delete('/triptypes/:listId/items/:itemId', staticContent.deletePackingItemFromList);

    // weather routes
    app.get('/weather', staticContent.getPackingListsOfType("weather"));
    app.get('/weather/:listId', staticContent.getSinglePackingList);
    app.get('/weather/:listId/items', staticContent.getItemsForPackingList);
    app.post('/weather', staticContent.createPackingListOfType("weather"));
    app.post('/weather/:listId/items', staticContent.createPackingItemForList);
    app.patch('/weather/:listId', staticContent.updatePackingList);
    app.patch('/weather/:listId/items/:itemId', staticContent.updatePackingItemForList);
    app.delete('/weather/:listId', staticContent.deletePackingList);
    app.delete('/weather/:listId/items/:itemId', staticContent.deletePackingItemFromList);
}