import request from "supertest";

import app from "../../app";

import static_accomodation from "../static/accomodation.json";
import static_activities from "../static/activities.json";
import static_transport from "../static/transport.json";
import static_triptypes from "../static/triptypes.json";
import static_weather from "../static/weather.json";

describe("Static routes", () => {
  test("Get all accomodations", async () => {
    const res = await request(app).get("/api/accomodation");
    expect(res.body).toEqual(static_accomodation);
  });
  test("Get all activities", async () => {
    const res = await request(app).get("/api/activities");
    expect(res.body).toEqual(static_activities);
  });
  test("Get all transports", async () => {
    const res = await request(app).get("/api/transport");
    expect(res.body).toEqual(static_transport);
  });
  test("Get all triptypes", async () => {
    const res = await request(app).get("/api/triptypes");
    expect(res.body).toEqual(static_triptypes);
  });
  test("Get all weathers", async () => {
    const res = await request(app).get("/api/weather");
    expect(res.body).toEqual(static_weather);
  });
});
