import request from "supertest";

import app from "../../app";

import basics_standalone from "../json/compiler/basics_standalone.json";
import basics_result_car from "../json/compiler/basics_car.json";
import basics_result_train from "../json/compiler/basics_train.json";
import basics_result_bus from "../json/compiler/basics_bus.json";
import cycling_standalone from "../json/compiler/cycling_standalone.json";
import sunny_standalone from "../json/compiler/sunny_standalone.json";
import business_standalone from "../json/compiler/business_standalone.json";
import camping_standalone from "../json/compiler/camping_standalone.json";
import cycling_diving from "../json/compiler/cycling_diving.json";
import sunny_warm from "../json/compiler/sunny_warm.json";

describe("Static routes", () => {
  /*
   * Test empty object
   */
  test("Test empty choices of activities and weather", async () => {
    const res = await request(app)
      .post("/api/compile")
      .send({})
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toEqual(basics_standalone);
  });
  /*
   * Test empty choice arrays in different combinations
   */
  test("Test empty choices of activities and weather", async () => {
    const res = await request(app)
      .post("/api/compile")
      .send({
        accomodation: "hotel",
        activities: [],
        transport: "car",
        triptype: "leisure",
        weather: [],
      })
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toEqual(basics_result_car);
  });
  test("Consecutive Test with empty choices of activities and weather and different transport", async () => {
    const res = await request(app)
      .post("/api/compile")
      .send({
        accomodation: "hotel",
        activities: [],
        transport: "train",
        triptype: "leisure",
        weather: [],
      })
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toEqual(basics_result_train);
  });
  /*
   * Test duplicates in choice arrays in different combinations
   */
  test("Test to ignore duplicate activities", async () => {
    const res = await request(app)
      .post("/api/compile")
      .send({
        accomodation: "hotel",
        activities: ["cycling", "cycling"],
        transport: "car",
        triptype: "leisure",
        weather: [],
      })
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toEqual(cycling_standalone);
  });
  test("Test to ignore duplicate weathers", async () => {
    const res = await request(app)
      .post("/api/compile")
      .send({
        accomodation: "hotel",
        activities: [],
        transport: "car",
        triptype: "leisure",
        weather: ["sunny", "sunny"],
      })
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toEqual(sunny_standalone);
  });
  /*
   * Test nonsense in choice arrays in different combinations
   */
  test("Test to ignore nonsense activities", async () => {
    const res = await request(app)
      .post("/api/compile")
      .send({
        accomodation: "hotel",
        activities: ["nonsense"],
        transport: "car",
        triptype: "leisure",
        weather: [],
      })
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toEqual(basics_result_car);
  });
  test("Test to ignore nonsense activities mixed with actual", async () => {
    const res = await request(app)
      .post("/api/compile")
      .send({
        accomodation: "hotel",
        activities: ["nonsense", "cycling"],
        transport: "car",
        triptype: "leisure",
        weather: [],
      })
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toEqual(cycling_standalone);
  });
  test("Test to ignore nonsense weather", async () => {
    const res = await request(app)
      .post("/api/compile")
      .send({
        accomodation: "hotel",
        activities: [],
        transport: "car",
        triptype: "leisure",
        weather: ["raining cats and dogs"],
      })
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toEqual(basics_result_car);
  });
  test("Test to ignore nonsense weather mixed with actual", async () => {
    const res = await request(app)
      .post("/api/compile")
      .send({
        accomodation: "hotel",
        activities: [],
        transport: "car",
        triptype: "leisure",
        weather: ["raining cats and dogs", "sunny"],
      })
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toEqual(sunny_standalone);
  });
  /*
   * Test trip types
   */
  test("Test trip type business with empty choices", async () => {
    const res = await request(app)
      .post("/api/compile")
      .send({
        accomodation: "hotel",
        activities: [],
        transport: "car",
        triptype: "business",
        weather: [],
      })
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toEqual(business_standalone);
  });
  /*
   * Test transport types
   */
  test("Test transport type coach/bus with empty choices", async () => {
    const res = await request(app)
      .post("/api/compile")
      .send({
        accomodation: "hotel",
        activities: [],
        transport: "bus",
        triptype: "leisure",
        weather: [],
      })
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toEqual(basics_result_bus);
  });
  /*
   * Test accomodation types
   */
  test("Test accomodation type camping with empty choices", async () => {
    const res = await request(app)
      .post("/api/compile")
      .send({
        accomodation: "camping",
        activities: [],
        transport: "car",
        triptype: "leisure",
        weather: [],
      })
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toEqual(camping_standalone);
  });
  /*
   * Test combining activities
   */
  test("Test combining two or more activities", async () => {
    const res = await request(app)
      .post("/api/compile")
      .send({
        accomodation: "hotel",
        activities: ["cycling", "diving"],
        transport: "car",
        triptype: "leisure",
        weather: [],
      })
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toEqual(cycling_diving);
  });
  /*
  * Test combining weathers
  */
 test("Test combining two or more weathers", async () => {
   const res = await request(app)
   .post("/api/compile")
   .send({
     accomodation: "hotel",
     activities: [],
     transport: "car",
     triptype: "leisure",
     weather: ["sunny", "warm"],
    })
    .expect("Content-Type", /json/)
    .expect(200);
    expect(res.body).toEqual(sunny_warm);
  });
  /*
  * Test combining weathers while ignoring duplicates and nonsense
  */
 test("Test combining two or more weathers while ignoring duplicates and nonsense", async () => {
   const res = await request(app)
   .post("/api/compile")
   .send({
     accomodation: "hotel",
     activities: [],
     transport: "car",
     triptype: "leisure",
     weather: ["sunny", "sunny", "warm", "raining cats and dogs", "sunny"],
    })
    .expect("Content-Type", /json/)
    .expect(200);
    expect(res.body).toEqual(sunny_warm);
  });
  /*
   * Test combining activities while ignoring duplicates and nonsense
   */
  test("Test combining two or more activities while ignoring duplicates and nonsense", async () => {
    const res = await request(app)
      .post("/api/compile")
      .send({
        accomodation: "hotel",
        activities: ["cycling", "cycling", "diving", "thumb twiddling", "cycling"],
        transport: "car",
        triptype: "leisure",
        weather: [],
      })
      .expect("Content-Type", /json/)
      .expect(200);
    expect(res.body).toEqual(cycling_diving);
  });
});
