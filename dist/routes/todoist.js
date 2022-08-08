"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const modules_1 = require("../modules");
const register = (app) => {
    app.post('/submitTasks', modules_1.todoist.submitTasks);
};
exports.register = register;
//# sourceMappingURL=todoist.js.map