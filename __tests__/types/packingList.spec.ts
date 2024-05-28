import { PackingList } from "../../types/packingList";

function _getDueDateString(tripDate: Date, offset?: number): string {
  const copyDate = new Date(tripDate);
  offset = offset || -1;
  copyDate.setDate(copyDate.getDate() + offset);
  return copyDate.toISOString().split("T")[0];
}

describe("Test packingList functions", () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextSaturday = new Date();
  nextSaturday.setDate(
    nextSaturday.getDate() + ((7 + 6 - nextSaturday.getDay()) % 7)
  );

  test("Test dayThreshold not surpassed", () => {
    const packingList = new PackingList();
    packingList.toiletries.content = [
      {
        name: "Rasierer",
        dayThreshold: 4,
      },
    ];
    const todoistJSON = packingList.convertToTodoistJSON(
      "Test trip",
      2,
      tomorrow
    );
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
    const todoistJSON = packingList.convertToTodoistJSON(
      "Test trip",
      4,
      tomorrow
    );
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
    const todoistJSON = packingList.convertToTodoistJSON(
      "Test trip",
      6,
      tomorrow
    );
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
    const todoistJSON = packingList.convertToTodoistJSON(
      "Test trip",
      4,
      tomorrow
    );
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

  test("Test no weekday is given", () => {
    const packingList = new PackingList();
    packingList.organisational.content = [
      {
        name: "OOO erstellen",
        onlyIfWeekday: true,
        additionalLabels: ["Arbeit", "Reisen"],
        addTripNameToTask: true,
        dueShift: -2,
      },
    ];

    const todoistJSON = packingList.convertToTodoistJSON(
      "Test trip",
      2,
      nextSaturday
    );
    expect(todoistJSON).toEqual([]);
  });

  test("Test weekday is given", () => {
    const packingList = new PackingList();
    const dueShift = -2;
    const tripName = "Test Trip";
    packingList.organisational.content = [
      {
        name: "OOO erstellen",
        onlyIfWeekday: true,
        additionalLabels: ["Arbeit", "Reisen"],
        addTripNameToTask: true,
        dueShift: dueShift,
      },
    ];

    const shiftedDueString = _getDueDateString(tomorrow, dueShift)

    // > 2 days ensures there is a weekday in the trip
    const todoistJSON = packingList.convertToTodoistJSON(
      tripName,
      4,
      tomorrow
    );
    expect(todoistJSON).toEqual([
      {
        task: {
          content: "Organisatorisches",
        },
        subTasks: [
          {
            content: "OOO erstellen für "+ tripName,
            labels: ["Arbeit", "Reisen"],
            dueDate: shiftedDueString,
          },
        ],
      },
    ]);
  });
});
