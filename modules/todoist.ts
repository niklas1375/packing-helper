import { TodoistApi } from "@doist/todoist-api-typescript";
import { Request, Response } from "express";
import { PackingList } from "../types/packingList";
// import { fallbackTodoistApiToken } from "./secret-config";

let globalOpenCounter: number = 1;
let globalResolvedCounter: number = 0;

async function submitTasks(req: Request, res: Response) {
  const tripBeginDate = new Date(req.body.tripBeginDate);
  const packingList = new PackingList();
  Object.assign(packingList, req.body.packingList);
  const todoistJson = packingList.convertToTodoistJSON(
    req.body.tripName,
    req.body.tripLength,
    tripBeginDate,
  );
  const api = _getTodoistApi(req, res);
  if (!api) {
    return;
  }
  let rootTaskId: string;

  const rootTask = await api.addTask({
    content: "Packen für " + req.body.tripName,
    dueDate: _getDueDate(tripBeginDate),
    labels: ["Reisen"],
  });
  // skip finished log here because it would only show 1 of 1
  globalResolvedCounter += 1;
  rootTaskId = rootTask.id;
  return _traverseTasks(todoistJson, rootTaskId, api)
    .then(() => {
      res.status(201);
      res.json({
        status: 201,
        text: "Created",
        rootTaskId: rootTaskId,
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
    globalOpenCounter += 1;
    const task = jsonTask.task ? jsonTask.task : jsonTask;
    task.parentId = parentTaskId;

    /**
     * push task creation to promise array. `Then` returns a promise which is
     * immediately resolved if no subTask is present. If one is present, the
     * new promise is pushed to the array and the previous then promise is resolved
     */
    innerPromiseArray.push(
      new Promise((resolve, reject) => {
        api
          .addTask(task)
          .then((createdParentTask) => {
            if (!jsonTask.subTasks || jsonTask.subTasks.length <= 0) {
              // no subtasks? resolve and count
              _TaskFinished();
              resolve(createdParentTask);
              return;
            }
            // subtasks? push sub promise - resolve and count afterwards
            innerPromiseArray.push(
              _traverseTasks(jsonTask.subTasks, createdParentTask.id, api)
            );
            _TaskFinished();
            resolve(createdParentTask);
          })
          .catch(reject);
      })
    );
  }
  return Promise.all(innerPromiseArray);
}

function _TaskFinished() {
  globalResolvedCounter += 1;
  if (globalResolvedCounter > globalOpenCounter) return;
  // don't log in test
  if (process.env.JEST_WORKER_ID !== undefined || process.env.NODE_ENV === 'test') return;
  console.debug(
    `Resolved ${globalResolvedCounter} of ${globalOpenCounter} Tasks`
  );
}

function _getDueDate(tripDate: Date): string {
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
