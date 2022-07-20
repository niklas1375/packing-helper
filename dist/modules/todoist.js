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
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitTasks = void 0;
const todoist_api_typescript_1 = require("@doist/todoist-api-typescript");
const packingList_1 = require("../types/packingList");
const TODOIST_API_TOKEN = process.env.TODOIST_API_TOKEN || "";
const api = new todoist_api_typescript_1.TodoistApi(TODOIST_API_TOKEN);
function submitTasks(req, res) {
    const packingList = new packingList_1.PackingList();
    Object.assign(packingList, req.body);
    res.json(packingList.convertToTodoistJSON());
}
exports.submitTasks = submitTasks;
function _createDeepTasks(task) {
    return __awaiter(this, void 0, void 0, function* () {
        return api.addTask(task);
    });
}
