import express from "express";
import session from "express-session";
declare module "express-session" {
  interface SessionData {
    state_token?: string;
    todoist_token?: string;
  }
}
import {
  fallbackTodoistApiToken,
  sessionSecret,
} from "../../modules/secret-config";

import request from "supertest";
import { TodoistApi } from "@doist/todoist-api-typescript";

import "../../jest.setup";

import app from "../../app";

describe("Submit Tasks to todoist", () => {
  // set up session token to use fallbackTodoistApiToken
  var mockApp = express();
  mockApp.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
    })
  );
  mockApp.all("*", function (req, _, next) {
    req.session.todoist_token = fallbackTodoistApiToken;
    next();
  });
  mockApp.use(app);

  // increase timeout due to performance of nested task creation
  jest.setTimeout(30000);
  /*
   * Create basic packing list first and create todoist task second
   * Duration of trip contains at least one weekday
   */
  test("Test submitting tasks to todoist during the week", async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const compileRes = await request(mockApp)
      .post("/api/compile")
      .send({})
      .expect("Content-Type", /json/)
      .expect(200);
    const submitRes = await request(mockApp)
      .post("/api/submitTasks")
      .send({
        tripName: "Testtrip",
        tripLength: 5, // makes sure there's at least one weekday
        tripBeginDate: tomorrow.toISOString(),
        packingList: compileRes.body,
      })
      .expect("Content-Type", /json/)
      .expect(201);
    expect(submitRes.body).toBeSubmitResponse();

    const api = new TodoistApi("" + process.env.TODOIST_API_TOKEN);
    // check for main packing tasks
    const createdTask = await api.getTask(submitRes.body.rootTaskId);
    expect(createdTask.id).toBe(submitRes.body.rootTaskId);
    // check for OOO task
    const createdOOOTask = await api.getTask(submitRes.body.oooTaskId);
    expect(createdOOOTask.id).toBe(submitRes.body.oooTaskId);
    // deep check would also be possible...

    // clean up
    // expect(await api.deleteTask("" + submitRes.body.rootTaskId)).toBeTruthy();
  });

  /*
   * Create basic packing list first and create todoist task second
   * Duration of trip contains at least one weekday
   */
  test("Test submitting tasks to todoist on weekend only", async () => {
    // get next saturday to test non-creation of ooo task
    const nextSaturday = new Date();
    nextSaturday.setDate(
      nextSaturday.getDate() + ((7 + 6 - nextSaturday.getDay()) % 7)
    );
    console.log(nextSaturday.toISOString());

    const compileRes = await request(mockApp)
      .post("/api/compile")
      .send({})
      .expect("Content-Type", /json/)
      .expect(200);
    const submitRes = await request(mockApp)
      .post("/api/submitTasks")
      .send({
        tripName: "Testtrip Wochenende",
        tripLength: 1, // makes sure there's only weekend
        tripBeginDate: nextSaturday.toISOString(),
        packingList: compileRes.body,
      })
      .expect("Content-Type", /json/)
      .expect(201);
    expect(submitRes.body).toBeSubmitResponse();

    const api = new TodoistApi("" + process.env.TODOIST_API_TOKEN);
    // check for main packing tasks
    const createdTask = await api.getTask(submitRes.body.rootTaskId);
    expect(createdTask.id).toBe(submitRes.body.rootTaskId);
    // check for OOO task not to be created
    expect(submitRes.body.oooTaskId).toBeUndefined();
    // deep check would also be possible...

    // clean up
    // expect(await api.deleteTask("" + submitRes.body.rootTaskId)).toBeTruthy();
  });
});
