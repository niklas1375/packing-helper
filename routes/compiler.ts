import { Router } from "express";
import { compiler } from "../modules";

export const register = (app: Router) => {
    app.post('/compile', compiler.compileListFromSelections);
}