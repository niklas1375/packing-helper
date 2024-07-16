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
    const in3Days = new Date();
    in3Days.setDate(in3Days.getDate() + 3);
    const in8Days = new Date();
    in8Days.setDate(in3Days.getDate() + 8);
    const tripBasics = {
      tripName: "Testtrip",
      tripLength: 5,
      tripBeginDate: in3Days.toISOString(),
      endDate: in8Days.toISOString(),
    };

    const compileRes = await request(mockApp)
      .post("/api/compile")
      .send({
        tripname: tripBasics.tripName,
        tripstart: tripBasics.tripBeginDate,
        tripend: tripBasics.endDate,
        isAbroad: false,
      })
      .expect("Content-Type", /json/)
      .expect(200);
    const submitRes = await request(mockApp)
      .post("/api/submitTasks")
      .send({
        ...tripBasics,
        packingList: compileRes.body,
      })
      .expect("Content-Type", /json/)
      .expect(201);
    expect(submitRes.body).toBeSubmitResponse();

    const api = new TodoistApi("" + process.env.TODOIST_API_TOKEN);
    // check for main packing tasks
    const createdTask = await api.getTask(submitRes.body.rootTaskId);
    expect(createdTask.id).toBe(submitRes.body.rootTaskId);
    // deep check would also be possible...

    // clean up
    // expect(await api.deleteTask("" + submitRes.body.rootTaskId)).toBeTruthy();
  });
});
