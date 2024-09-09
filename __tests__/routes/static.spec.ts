import request from "supertest";

import app from "../../app";

describe("Static routes", () => {
  test("Get all accomodations", async () => {
    const res = await request(app).get("/api/accomodation");
    expect(res.body).toMatchSnapshot();
  });
  test("Get all activities", async () => {
    const res = await request(app).get("/api/activities");
    expect(res.body).toMatchSnapshot();
  });
  test("Get all transports", async () => {
    const res = await request(app).get("/api/transport");
    expect(res.body).toMatchSnapshot();
  });
  test("Get all triptypes", async () => {
    const res = await request(app).get("/api/triptypes");
    expect(res.body).toMatchSnapshot();
  });
  test("Get all weathers", async () => {
    const res = await request(app).get("/api/weather");
    expect(res.body).toMatchSnapshot();
  });
});
