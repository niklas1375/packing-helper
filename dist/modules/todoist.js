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
    Object.assign(packingList, req.body.packingList);
    const todoistJson = packingList.convertToTodoistJSON(req.body.tripLength);
    console.log(req.body.tripName);
    api.addTask({
        content: "Packen für " + req.body.tripName,
        dueDate: _getDueDate(req.body.tripBeginDate)
    }).then((rootTask) => {
        // await _traverseTasks(todoistJson, rootTask.id);
        // res.status(201);
        // res.send("Created");
        res.json(rootTask);
    }).catch((error) => {
        console.log(error);
    });
}
exports.submitTasks = submitTasks;
function _traverseTasks(todoistJSON, rootTaskId) {
    return __awaiter(this, void 0, void 0, function* () {
        const innerPromiseArray = [];
        for (let mainTask of todoistJSON) {
            mainTask.parent_id = rootTaskId;
            const createdTask = yield api.addTask(mainTask);
            for (let subTask of mainTask.subTasks) {
                subTask.parent_id = createdTask.id;
                innerPromiseArray.push(api.addTask(subTask));
            }
        }
        return Promise.all(innerPromiseArray);
    });
}
function _getDueDate(tripBeginDate) {
    const tripDate = new Date(tripBeginDate);
    tripDate.setDate(tripDate.getDate() - 1);
    return tripDate.toISOString().split("T")[0];
}
