"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
require("dotenv/config");
const secret_config_1 = require("./modules/secret-config");
const port = 3000;
const routes = __importStar(require("./routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: secret_config_1.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: "auto",
        maxAge: 3600000,
    },
}));
const router = express_1.default.Router();
routes.register(router);
app.use("/api", router);
// run server
app.listen(port, () => {
    console.log(`[server]: Server is running at https://localhost:${port}`);
});
//# sourceMappingURL=index.js.map