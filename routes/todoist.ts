import { Router } from "express";
import { todoist } from '../modules';

export const register = (app: Router) => {
    app.post('/submitTasks', todoist.submitTasks);
}