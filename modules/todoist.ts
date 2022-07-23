import { Task, TodoistApi } from "@doist/todoist-api-typescript";
import { Request, Response } from "express";
import { PackingList } from "../types/packingList";

const TODOIST_API_TOKEN: string = process.env.TODOIST_API_TOKEN || "";
const api = new TodoistApi(TODOIST_API_TOKEN);

function submitTasks(req: Request, res: Response) {
  const packingList = new PackingList();
  Object.assign(packingList, req.body.packingList);
  const todoistJson = packingList.convertToTodoistJSON(req.body.tripLength);
  api.addTask({
    content: "Packen für " + req.body.tripName,
    dueDate: _getDueDate(req.body.tripBeginDate)
  }).then((rootTask) => {
    _traverseTasks(todoistJson, rootTask.id).then(() => {
      res.status(201);
      res.send("Created");
    }).catch((error) => {
      console.log(error);
      res.status(500);
      res.send("Error. See logs for details.");
    });
  }).catch((error) => {
    console.log(error);
  });
}

async function _traverseTasks(todoistJSON: any[], parentTaskId: number): Promise<any []> {
  const innerPromiseArray = [];
  for (let jsonTask of todoistJSON) {
    const task = jsonTask.task ? jsonTask.task : jsonTask;
    task.parentId = parentTaskId;
    const createdTask = await api.addTask(task);
    if (jsonTask.subTasks && jsonTask.subTasks.length > 0) {
      innerPromiseArray.push(_traverseTasks(jsonTask.subTasks, createdTask.id));
    }
  }
  return Promise.all(innerPromiseArray);
}

function _getDueDate(tripBeginDate: Date): string {
  const tripDate = new Date(tripBeginDate);
  tripDate.setDate(tripDate.getDate() - 1);
  return tripDate.toISOString().split("T")[0];
}

export { submitTasks };
