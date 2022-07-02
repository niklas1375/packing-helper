import { Application } from "express";
import * as compiler from './compiler';
import * as staticContent from './static';

export const register = (app: Application) => {
    compiler.register(app);
    staticContent.register(app);
}