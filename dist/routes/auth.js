"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const modules_1 = require("../modules");
const register = (app) => {
    app.post("/auth/login", modules_1.auth.loginRedirect);
    app.get("/auth/oauth-callback", modules_1.auth.loginCallback);
    app.get('/auth/logout', modules_1.auth.logout);
};
exports.register = register;
