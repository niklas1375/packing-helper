import { PackingList } from "../../types/packingList";

describe("Test packingList functions", () => {
  test("Test dayThreshold not surpassed", () => {
    const packingList = new PackingList();
    packingList.toiletries.content = [
      {
        name: "Rasierer",
        dayThreshold: 4,
      },
    ];
    const todoistJSON = packingList.convertToTodoistJSON(2);
    expect(todoistJSON).toEqual([]);
  });

  test("Test dayThreshold equaled", () => {
    const packingList = new PackingList();
    packingList.toiletries.content = [
      {
        name: "Rasierer",
        dayThreshold: 4,
      },
    ];
    const todoistJSON = packingList.convertToTodoistJSON(4);
    console.dir(todoistJSON);
    expect(todoistJSON).toEqual([
      {
        task: {
          content: "Hygiene & Co.",
        },
        subTasks: [
          {
            content: "Rasierer",
          },
        ],
      },
    ]);
  });

  test("Test dayThreshold surpassed", () => {
    const packingList = new PackingList();
    packingList.toiletries.content = [
      {
        name: "Rasierer",
        dayThreshold: 4,
      },
    ];
    const todoistJSON = packingList.convertToTodoistJSON(6);
    console.dir(todoistJSON);
    expect(todoistJSON).toEqual([
      {
        task: {
          content: "Hygiene & Co.",
        },
        subTasks: [
          {
            content: "Rasierer",
          },
        ],
      },
    ]);
  });

  test("Test dayMultiplier surpassed", () => {
    const packingList = new PackingList();
    packingList.clothing.content = [
      {
        name: "Socken",
        dayMultiplier: 1,
      },
    ];
    const todoistJSON = packingList.convertToTodoistJSON(4);
    console.dir(todoistJSON);
    expect(todoistJSON).toEqual([
      {
        task: {
          content: "Kleidung",
        },
        subTasks: [
          {
            content: "4x Socken",
          },
        ],
      },
    ]);
  });
});
