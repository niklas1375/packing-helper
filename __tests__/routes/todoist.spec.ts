import request from "supertest";
import "../../jest.setup";

import app from "../../app";

describe("Submit Tasks to todoist", () => {
  /*
   * Create basic packing list first and create todoist task second
   */
  test("Test submitting tasks to todoist", async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const compileRes = await request(app)
      .post("/api/compile")
      .send({})
      .expect("Content-Type", /json/)
      .expect(200);
    const submitRes = await request(app)
      .post("/api/submitTasks")
      .send({
        tripName: "Testtrip",
        tripLength: 5,
        tripBeginDate: tomorrow.toISOString(),
        packingList: compileRes.body,
      })
      .expect("Content-Type", /json/)
      .expect(201);
    expect(submitRes.body).toBeSubmitResponse();
    // --> check created task (& delete) via api as well? Would need task ID in reply...
  });
});
