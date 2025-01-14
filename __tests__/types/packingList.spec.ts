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
    const tripName = "Test trip";
    const tripLength = 2;
    const tripBeginDate = tomorrow;
    const isAbroad = false;

    const packingList = new PackingList();
    packingList.toiletries.content = [
      {
        name: "Rasierer",
        category: "toiletries",
        dayThreshold: 4,
      },
    ];

    packingList.filterForExclusions(tripLength, tripBeginDate, isAbroad);
    const todoistJSON = packingList.convertToTodoistJSON(
      tripName,
      tripLength,
      tripBeginDate
    );
    expect(todoistJSON).toEqual([]);
  });

  test("Test dayThreshold equaled", () => {
    const tripName = "Test trip";
    const tripLength = 4;
    const tripBeginDate = tomorrow;
    const isAbroad = false;

    const packingList = new PackingList();
    packingList.toiletries.content = [
      {
        name: "Rasierer",
        category: "toiletries",
        dayThreshold: 4,
      },
    ];
    packingList.filterForExclusions(tripLength, tripBeginDate, isAbroad);
    const todoistJSON = packingList.convertToTodoistJSON(
      tripName,
      tripLength,
      tripBeginDate
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
    const tripName = "Test trip";
    const tripLength = 6;
    const tripBeginDate = tomorrow;
    const isAbroad = false;

    const packingList = new PackingList();
    packingList.toiletries.content = [
      {
        name: "Rasierer",
        category: "toiletries",
        dayThreshold: 4,
      },
    ];
    packingList.filterForExclusions(tripLength, tripBeginDate, isAbroad);
    const todoistJSON = packingList.convertToTodoistJSON(
      tripName,
      tripLength,
      tripBeginDate
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
    const tripName = "Test trip";
    const tripLength = 4;
    const tripBeginDate = tomorrow;
    const isAbroad = false;

    const packingList = new PackingList();
    packingList.clothing.content = [
      {
        name: "Socken",
        category: "clothing",
        dayMultiplier: 1,
      },
    ];
    packingList.filterForExclusions(tripLength, tripBeginDate, isAbroad);
    const todoistJSON = packingList.convertToTodoistJSON(
      tripName,
      tripLength,
      tripBeginDate
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
        category: "clothing",
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
        category: "clothing",
        relevantForWeather: ["wet"],
      },
    ];

    packingListA.addPackingList(packingListB, ["wet"]);

    expect(packingListA.clothing.content).toEqual([
      {
        name: "Regenjacke",
        category: "clothing",
        relevantForWeather: ["wet"],
      },
    ]);
  });

  test("Test no weekday is given", () => {
    const tripName = "Test trip";
    const tripLength = 2;
    const tripBeginDate = nextSaturday;
    const isAbroad = false;

    const packingList = new PackingList();
    packingList.organisational.content = [
      {
        name: "OOO erstellen",
        category: "organisational",
        onlyIfWeekday: true,
        additionalLabels: ["Arbeit", "Reisen"],
        addTripNameToTask: true,
        dueShift: -2,
      },
    ];

    packingList.filterForExclusions(tripLength, tripBeginDate, isAbroad);
    const todoistJSON = packingList.convertToTodoistJSON(
      tripName,
      tripLength,
      tripBeginDate
    );
    expect(todoistJSON).toEqual([]);
  });

  test("Test weekday is given", () => {
    const tripName = "Test trip";
    const tripLength = 4;
    const tripBeginDate = tomorrow;
    const isAbroad = false;
    const dueShift = -2;

    const packingList = new PackingList();
    packingList.organisational.content = [
      {
        name: "OOO erstellen",
        category: "organisational",
        onlyIfWeekday: true,
        additionalLabels: ["Arbeit", "Reisen"],
        addTripNameToTask: true,
        dueShift: dueShift,
      },
    ];

    const shiftedDueString = _getDueDateString(tomorrow, dueShift);

    packingList.filterForExclusions(tripLength, tripBeginDate, isAbroad);
    // > 2 days ensures there is a weekday in the trip
    const todoistJSON = packingList.convertToTodoistJSON(
      tripName,
      tripLength,
      tripBeginDate
    );
    expect(todoistJSON).toEqual([
      {
        task: {
          content: "Organisatorisches",
        },
        subTasks: [
          {
            content: "OOO erstellen für " + tripName,
            description: tripName,
            labels: ["Arbeit", "Reisen"],
            dueDate: shiftedDueString,
          },
        ],
      },
    ]);
  });
});
