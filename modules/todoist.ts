import { Task, TodoistApi } from "@doist/todoist-api-typescript";
import { Request, Response } from "express";
import { PackingList } from "../types/packingList";

const TODOIST_API_TOKEN: string = process.env.TODOIST_API_TOKEN || "";
const api = new TodoistApi(TODOIST_API_TOKEN);

function submitTasks(req: Request, res: Response) {
  const packingList = new PackingList();
  Object.assign(packingList, req.body);
  res.json(packingList.convertToTodoistJSON())
}

async function _createDeepTasks(task: Task) {
  return api.addTask(task);
}

export { submitTasks };
