import { Application } from "express";
import { todoist } from '../modules';

export const register = (app: Application) => {
    app.post('/submitTasks', todoist.submitTasks);
}