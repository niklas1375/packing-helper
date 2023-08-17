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
  let rootTaskId: string;
  let oooTaskId: string;
  const tripBeginDate = new Date(req.body.tripBeginDate)
  const dueDate = _getDueDate(tripBeginDate);
  const rootTaskPromiseArray: any[] = [];
  // only create ooo task if trip occurs on at least one weekday
  if (_checkIfContainsWeekday(tripBeginDate, req.body.tripLength)) {
    rootTaskPromiseArray.push(
      api
        .addTask({
          content: "OOO erstellen für " + req.body.tripName,
          dueDate: dueDate,
          labels: ["Arbeit", "Reisen"],
        })
        .then((oooTask) => {
          oooTaskId = oooTask.id;
        })
    );
  }
  rootTaskPromiseArray.push(
    api
      .addTask({
        content: "Packen für " + req.body.tripName,
        dueDate: dueDate,
        labels: ["Reisen"],
      })
      .then((rootTask) => {
        rootTaskId = rootTask.id;
        _traverseTasks(todoistJson, rootTaskId, api);
      })
  );
  Promise.all(rootTaskPromiseArray)
    .then(() => {
      res.status(201);
      res.json({
        status: 201,
        text: "Created",
        rootTaskId: rootTaskId,
        oooTaskId: oooTaskId,
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

function _checkIfContainsWeekday(
  tripBeginDate: Date,
  tripLength: number
): boolean {
  // longer than 2 days automatically means inclusion of a weekday
  if (tripLength > 2) return true;
  const beginDay = tripBeginDate.getDay();
  // day before saturday is beginDay
  if (beginDay < 5) return true;
  // 2 day trip beginning on sunday is the last remaining option for a weekday to occur
  return beginDay == 6 && tripLength > 1;
}

export { submitTasks };
