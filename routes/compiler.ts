import { Application } from "express";
import { compiler } from "../modules";

export const register = (app: Application) => {
    app.post('/compile', compiler.compileListFromSelections);
}