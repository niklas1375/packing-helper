import { Task, TodoistApi } from "@doist/todoist-api-typescript";
import { Request, Response } from "express";
import { PackingList } from "../types/packingList";

const TODOIST_API_TOKEN: string = process.env.TODOIST_API_TOKEN || "";
const api = new TodoistApi(TODOIST_API_TOKEN);

function submitTasks(req: Request, res: Response) {
  const packingList = new PackingList();
  Object.assign(packingList, req.body.packingList);
  const todoistJson = packingList.convertToTodoistJSON(req.body.tripLength);
  console.log(req.body.tripName);
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

async function _traverseTasks(todoistJSON: any[], rootTaskId: number) {
  const innerPromiseArray = [];
  for (let mainTask of todoistJSON) {
    mainTask.task.parentId = rootTaskId;
    const createdTask = await api.addTask(mainTask.task);
    for (let subTask of mainTask.subTasks) {
      subTask.parentId = createdTask.id;
      innerPromiseArray.push(api.addTask(subTask));
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
