"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const modules_1 = require("../modules");
const register = (app) => {
    app.post('/compile', modules_1.compiler.compileListFromSelections);
};
exports.register = register;
//# sourceMappingURL=compiler.js.map