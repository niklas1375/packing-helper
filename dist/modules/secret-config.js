"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionSecret = exports.todoistScopes = exports.todoistClientSecret = exports.todoistClientId = exports.fallbackTodoistApiToken = void 0;
const fs_1 = __importDefault(require("fs"));
let todoistClientId, todoistClientSecret, todoistScopes, sessionSecret, fallbackTodoistApiToken;
exports.todoistClientId = todoistClientId;
exports.todoistClientSecret = todoistClientSecret;
exports.todoistScopes = todoistScopes;
exports.sessionSecret = sessionSecret;
exports.fallbackTodoistApiToken = fallbackTodoistApiToken;
if (process.env.CONTAINER_RUN && process.env.CONTAINER_RUN == "1") {
    // running in container setup with secrets
    exports.fallbackTodoistApiToken = fallbackTodoistApiToken = read("fallbackTodoistApiToken");
    exports.todoistClientId = todoistClientId = read("todoistClientId");
    exports.todoistClientSecret = todoistClientSecret = read("todoistClientSecret");
    exports.todoistScopes = todoistScopes = read("todoistScopes");
    exports.sessionSecret = sessionSecret = read("sessionSecret");
}
else {
    // running locally with .env
    exports.fallbackTodoistApiToken = fallbackTodoistApiToken = "" + process.env.TODOIST_API_TOKEN;
    exports.todoistClientId = todoistClientId = "" + process.env.TODOIST_CLIENT_ID;
    exports.todoistClientSecret = todoistClientSecret = "" + process.env.TODOIST_CLIENT_SECRET;
    exports.todoistScopes = todoistScopes = "" + process.env.TODOIST_SCOPES;
    exports.sessionSecret = sessionSecret = "" + process.env.SESSION_SECRET;
}
function read(secretName) {
    try {
        return fs_1.default.readFileSync(`/run/secrets/${secretName}`, "utf8");
    }
    catch (err) {
        if (err["code"] !== "ENOENT") {
            console.error(`An error occurred while trying to read the secret: ${secretName}. Err: ${err}`);
        }
        else {
            console.debug(`Could not find the secret, probably not running in swarm mode: ${secretName}. Err: ${err}`);
        }
        return "";
    }
}
//# sourceMappingURL=secret-config.js.map