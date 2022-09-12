import request from "supertest";

import app from "../../app";

describe("Submit Tasks to todoist", () => {
    interface LoginResponse {
        loggedIn: boolean;
        client_id?: string;
        scopes?: string;
        state?: string;
    }

  /*
   * Check if non authenticated request gets replied with correct info
   */
  test("Check login reply non-authenticated", async () => {
    const loginReply = request(app)
      .post("/api/auth/login")
      .send({})
      .expect("Content-Type", /json/)
      .expect(200);
    const loginReplyTyped = loginReply as any as LoginResponse;
    expect(loginReplyTyped.loggedIn).toBeFalsy();
  });
});
