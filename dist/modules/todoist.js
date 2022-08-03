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
function submitTasks(req, res) {
    const packingList = new packingList_1.PackingList();
    Object.assign(packingList, req.body.packingList);
    const todoistJson = packingList.convertToTodoistJSON(req.body.tripLength);
    const api = _getTodoistApi(req, res);
    if (api == undefined) {
        return;
    }
    api
        .addTask({
        content: "Packen für " + req.body.tripName,
        dueDate: _getDueDate(req.body.tripBeginDate),
    })
        .then((rootTask) => {
        _traverseTasks(todoistJson, rootTask.id, api)
            .then(() => {
            res.status(201);
            res.json({
                status: 201,
                text: "Created",
            });
        })
            .catch((error) => {
            console.log(error);
            res.status(500);
            res.send("Error. See logs for details.");
        });
    })
        .catch((error) => {
        console.log(error);
        res.status(500);
        res.send("Error. See logs for details.");
    });
}
exports.submitTasks = submitTasks;
function _traverseTasks(todoistJSON, parentTaskId, api) {
    return __awaiter(this, void 0, void 0, function* () {
        const innerPromiseArray = [];
        for (let jsonTask of todoistJSON) {
            const task = jsonTask.task ? jsonTask.task : jsonTask;
            task.parentId = parentTaskId;
            const createdTask = yield api.addTask(task);
            if (jsonTask.subTasks && jsonTask.subTasks.length > 0) {
                innerPromiseArray.push(_traverseTasks(jsonTask.subTasks, createdTask.id, api));
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
function _getTodoistApi(req, res) {
    if (req.session.todoist_token) {
        return new todoist_api_typescript_1.TodoistApi(req.session.todoist_token);
    }
    else {
        res.redirect("/auth/login");
        return undefined;
    }
}
//# sourceMappingURL=todoist.js.map