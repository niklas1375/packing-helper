"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.loginCallback = exports.loginRedirect = void 0;
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
const secret_config_1 = require("./secret-config");
function loginRedirect(req, res) {
    if (req.session.todoist_token) {
        res.status(200);
        res.send({
            loggedIn: true,
        });
        return;
    }
    const stateUUID = (0, uuid_1.v4)();
    req.session.state_token = stateUUID;
    res.json({
        loggedIn: false,
        client_id: secret_config_1.todoistClientId,
        scopes: secret_config_1.todoistScopes,
        state: stateUUID,
    });
}
exports.loginRedirect = loginRedirect;
function loginCallback(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const state = req.query.state;
        const code = req.query.code;
        if (state !== req.session.state_token) {
            res.status(400);
            res.json({
                message: "compromised request",
            });
            return;
        }
        yield axios_1.default
            .post("https://todoist.com/oauth/access_token", {
            client_id: secret_config_1.todoistClientId,
            client_secret: secret_config_1.todoistClientSecret,
            code: code,
        })
            .then((response) => {
            req.session.todoist_token = response.data.access_token;
            res.redirect("/");
        })
            .catch((response) => {
            var _a;
            console.log(((_a = response.data) === null || _a === void 0 ? void 0 : _a.error) || response);
            // TODO: error redirect?
        });
    });
}
exports.loginCallback = loginCallback;
function logout(req, res) {
    req.session.destroy((err) => {
        console.log(err);
    });
    res.status(200);
    res.json({
        message: "ok",
    });
}
exports.logout = logout;
//# sourceMappingURL=auth.js.map