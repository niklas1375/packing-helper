import { TodoistApi } from "@doist/todoist-api-typescript";
import { Request, Response } from "express";
import { PackingList } from "../types/packingList";
// import { fallbackTodoistApiToken } from "./secret-config";

function submitTasks(req: Request, res: Response) {
  const packingList = new PackingList();
  Object.assign(packingList, req.body.packingList);
  const todoistJson = packingList.convertToTodoistJSON(req.body.tripLength);
  const api = _getTodoistApi(req, res);
  if (!api) {
    return;
  }
  api
    .addTask({
      content: "Packen für " + req.body.tripName,
      dueDate: _getDueDate(req.body.tripBeginDate),
      labels: ["Reisen"],
    })
    .then((rootTask) => {
      _traverseTasks(todoistJson, rootTask.id, api)
        .then(() => {
          res.status(201);
          res.json({
            status: 201,
            text: "Created",
            rootTaskId: rootTask.id,
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

async function _traverseTasks(
  todoistJSON: any[],
  parentTaskId: string,
  api: TodoistApi
): Promise<any[]> {
  const innerPromiseArray = [];
  for (let jsonTask of todoistJSON) {
    const task = jsonTask.task ? jsonTask.task : jsonTask;
    task.parentId = parentTaskId;
    const createdTask = await api.addTask(task);
    if (jsonTask.subTasks && jsonTask.subTasks.length > 0) {
      innerPromiseArray.push(
        _traverseTasks(jsonTask.subTasks, createdTask.id, api)
      );
    }
  }
  return Promise.all(innerPromiseArray);
}

function _getDueDate(tripBeginDate: Date): string {
  const tripDate = new Date(tripBeginDate);
  tripDate.setDate(tripDate.getDate() - 1);
  return tripDate.toISOString().split("T")[0];
}

function _getTodoistApi(req: Request, res: Response): TodoistApi | undefined {
  // const token = fallbackTodoistApiToken; // use if token mechanism in todoist fails
  const token = req.session.todoist_token;
  if (token && token.length > 0) {
    return new TodoistApi(token);
  } else {
    res.redirect("/auth/login");
    return undefined;
  }
}

export { submitTasks };
