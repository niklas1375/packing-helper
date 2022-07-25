import { Router } from "express";
import * as compiler from './compiler';
import * as staticContent from './static';
import * as todoist from './todoist';

export const register = (app: Router) => {
    compiler.register(app);
    staticContent.register(app);
    todoist.register(app);
}