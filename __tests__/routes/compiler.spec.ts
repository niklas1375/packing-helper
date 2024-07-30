import request from "supertest";

import app from "../../app";

describe("Compiler routes", () => {
  // setup for 2 day trip during the week --> fixed dates
  const tripBasics = {
    tripname: "Testtrip",
    tripstart: new Date("2024-06-03").toISOString(),
    tripend: new Date("2024-06-05").toISOString(),
    isAbroad: false,
  };

  let camping: string,
    hotel: string,
    huette: string,
    youthhostel: string,
    cycling: string,
    diving: string,
    running: string,
    car: string,
    bus: string,
    flight: string,
    train: string,
    business: string,
    leisure: string,
    wet: string,
    sunny: string,
    warm: string;

  it("needs to be set up and jest won't let me do it another way", async () => {
    // setup mappings to send correct cuids
    const accomodation = await request(app).get("/api/accomodation");
    camping = accomodation.body.find(
      (item: { name: string }) => item.name === "Camping"
    ).key;
    hotel = accomodation.body.find(
      (item: { name: string }) => item.name === "Hotel"
    ).key;
    huette = accomodation.body.find(
      (item: { name: string }) => item.name === "Hütte"
    ).key;
    youthhostel = accomodation.body.find(
      (item: { name: string }) => item.name === "Jugendherberge"
    ).key;

    const activities = await request(app).get("/api/activities");
    cycling = activities.body.find(
      (item: { name: string }) => item.name === "Fahrrad fahren"
    ).key;
    diving = activities.body.find(
      (item: { name: string }) => item.name === "Tauchen"
    ).key;
    running = activities.body.find(
      (item: { name: string }) => item.name === "Laufen"
    ).key;

    const transport = await request(app).get("/api/transport");
    car = transport.body.find(
      (item: { name: string }) => item.name === "Auto"
    ).key;
    bus = transport.body.find(
      (item: { name: string }) => item.name === "Bus"
    ).key;
    flight = transport.body.find(
      (item: { name: string }) => item.name === "Flugzeug"
    ).key;
    train = transport.body.find(
      (item: { name: string }) => item.name === "Zug"
    ).key;

    const triptypes = await request(app).get("/api/triptypes");
    business = triptypes.body.find(
      (item: { name: string }) => item.name === "Business"
    ).key;
    leisure = triptypes.body.find(
      (item: { name: string }) => item.name === "Freizeit"
    ).key;

    const weather = await request(app).get("/api/weather");
    wet = weather.body.find(
      (item: { name: string }) => item.name === "Nasses Wetter"
    ).key;
    sunny = weather.body.find(
      (item: { name: string }) => item.name === "Sonniges Wetter"
    ).key;
    warm = weather.body.find(
      (item: { name: string }) => item.name === "Warmes Wetter"
    ).key;
  });

  /*
   * Test empty object
   */
  test("Test empty choices of activities and weather", async () => {
    const res = await request(app)
      .post("/api/compile")
      .send(tripBasics)
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toMatchSnapshot();
  });
  /*
   * Test empty choice arrays in different combinations
   */
  test("Test empty choices of activities and weather", async () => {
    const res = await request(app)
      .post("/api/compile")
      .send({
        ...tripBasics,
        accomodation: hotel,
        activities: [],
        transport: car,
        triptype: leisure,
        weather: [],
      })
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toMatchSnapshot();
  });
  test("Consecutive Test with empty choices of activities and weather and different transport", async () => {
    const res = await request(app)
      .post("/api/compile")
      .send({
        ...tripBasics,
        accomodation: hotel,
        activities: [],
        transport: train,
        triptype: leisure,
        weather: [],
      })
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toMatchSnapshot();
  });
  /*
   * Test duplicates in choice arrays in different combinations
   */
  test("Test to ignore duplicate activities", async () => {
    const res = await request(app)
      .post("/api/compile")
      .send({
        ...tripBasics,
        accomodation: hotel,
        activities: [cycling, cycling],
        transport: car,
        triptype: leisure,
        weather: [],
      })
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toMatchSnapshot();
  });
  test("Test to ignore duplicate weathers", async () => {
    const res = await request(app)
      .post("/api/compile")
      .send({
        ...tripBasics,
        accomodation: hotel,
        activities: [],
        transport: car,
        triptype: leisure,
        weather: [sunny, sunny],
      })
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toMatchSnapshot();
  });
  /*
   * Test nonsense in choice arrays in different combinations
   */
  test("Test to ignore nonsense activities", async () => {
    const res = await request(app)
      .post("/api/compile")
      .send({
        ...tripBasics,
        accomodation: hotel,
        activities: ["nonsense"],
        transport: car,
        triptype: leisure,
        weather: [],
      })
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toMatchSnapshot();
  });
  test("Test to ignore nonsense activities mixed with actual", async () => {
    const res = await request(app)
      .post("/api/compile")
      .send({
        ...tripBasics,
        accomodation: hotel,
        activities: ["nonsense", cycling],
        transport: car,
        triptype: leisure,
        weather: [],
      })
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toMatchSnapshot();
  });
  test("Test to ignore nonsense weather", async () => {
    const res = await request(app)
      .post("/api/compile")
      .send({
        ...tripBasics,
        accomodation: hotel,
        activities: [],
        transport: car,
        triptype: leisure,
        weather: ["raining cats and dogs"],
      })
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toMatchSnapshot();
  });
  test("Test to ignore nonsense weather mixed with actual", async () => {
    const res = await request(app)
      .post("/api/compile")
      .send({
        ...tripBasics,
        accomodation: hotel,
        activities: [],
        transport: car,
        triptype: leisure,
        weather: ["raining cats and dogs", sunny],
      })
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toMatchSnapshot();
  });
  /*
   * Test trip types
   */
  test("Test trip type business with empty choices", async () => {
    const res = await request(app)
      .post("/api/compile")
      .send({
        ...tripBasics,
        accomodation: hotel,
        activities: [],
        transport: car,
        triptype: business,
        weather: [],
      })
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toMatchSnapshot();
  });
  /*
   * Test transport types
   */
  test("Test transport type coach/bus with empty choices", async () => {
    const res = await request(app)
      .post("/api/compile")
      .send({
        ...tripBasics,
        accomodation: hotel,
        activities: [],
        transport: bus,
        triptype: leisure,
        weather: [],
      })
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toMatchSnapshot();
  });
  test("Test transport type flight with empty choices", async () => {
    const res = await request(app)
      .post("/api/compile")
      .send({
        ...tripBasics,
        accomodation: hotel,
        activities: [],
        transport: flight,
        triptype: leisure,
        weather: [],
      })
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toMatchSnapshot();
  });
  /*
   * Test accomodation types
   */
  test("Test accomodation type camping with empty choices", async () => {
    const res = await request(app)
      .post("/api/compile")
      .send({
        ...tripBasics,
        accomodation: camping,
        activities: [],
        transport: car,
        triptype: leisure,
        weather: [],
      })
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toMatchSnapshot();
  });
  test("Test accomodation type huette with empty choices", async () => {
    const res = await request(app)
      .post("/api/compile")
      .send({
        ...tripBasics,
        accomodation: huette,
        activities: [],
        transport: car,
        triptype: leisure,
        weather: [],
      })
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toMatchSnapshot();
  });
  test("Test accomodation type youthhostel with empty choices", async () => {
    const res = await request(app)
      .post("/api/compile")
      .send({
        ...tripBasics,
        accomodation: youthhostel,
        activities: [],
        transport: car,
        triptype: leisure,
        weather: [],
      })
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toMatchSnapshot();
  });
  /*
   * Test combining activities
   */
  test("Test combining two or more activities", async () => {
    const res = await request(app)
      .post("/api/compile")
      .send({
        ...tripBasics,
        accomodation: hotel,
        activities: [cycling, diving],
        transport: car,
        triptype: leisure,
        weather: [],
      })
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toMatchSnapshot();
  });
  /*
   * Test combining weathers
   */
  test("Test combining two or more weathers", async () => {
    const res = await request(app)
      .post("/api/compile")
      .send({
        ...tripBasics,
        accomodation: hotel,
        activities: [],
        transport: car,
        triptype: leisure,
        weather: [sunny, warm],
      })
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toMatchSnapshot();
  });
  /*
   * Test weather relevant items
   */
  test("Test weather dependent items", async () => {
    const res = await request(app)
      .post("/api/compile")
      .send({
        ...tripBasics,
        accomodation: hotel,
        activities: [running],
        transport: car,
        triptype: leisure,
        weather: [wet],
      })
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toMatchSnapshot();
  });
  /*
   * Test combining weathers while ignoring duplicates and nonsense
   */
  test("Test combining two or more weathers while ignoring duplicates and nonsense", async () => {
    const res = await request(app)
      .post("/api/compile")
      .send({
        ...tripBasics,
        accomodation: hotel,
        activities: [],
        transport: car,
        triptype: leisure,
        weather: [sunny, sunny, warm, "raining cats and dogs", sunny],
      })
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toMatchSnapshot();
  });
  /*
   * Test combining activities while ignoring duplicates and nonsense
   */
  test("Test combining two or more activities while ignoring duplicates and nonsense", async () => {
    const res = await request(app)
      .post("/api/compile")
      .send({
        ...tripBasics,
        accomodation: hotel,
        activities: [cycling, cycling, diving, "thumb twiddling", cycling],
        transport: car,
        triptype: leisure,
        weather: [],
      })
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toMatchSnapshot();
  });
});
