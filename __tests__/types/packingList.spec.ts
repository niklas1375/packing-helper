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

  test("Test weatherDependency not met", () => {
    const packingListA = new PackingList();
    const packingListB = new PackingList();
    packingListB.clothing.content = [
      {
        name: "Regenjacke",
        relevantForWeather: ["wet"],
      },
    ];

    packingListA.addPackingList(packingListB, ["sunny"]);

    expect(packingListA.clothing.content).toEqual([]);
  });

  test("Test weatherDependency met", () => {
    const packingListA = new PackingList();
    const packingListB = new PackingList();
    packingListB.clothing.content = [
      {
        name: "Regenjacke",
        relevantForWeather: ["wet"],
      },
    ];

    packingListA.addPackingList(packingListB, ["wet"]);

    expect(packingListA.clothing.content).toEqual([
      {
        name: "Regenjacke",
        relevantForWeather: ["wet"],
      },
    ]);
  });
});
