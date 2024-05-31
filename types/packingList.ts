import { PackingCategory } from "./packingCategory";
import { PackingItem } from "./packingItem";
import { IPackingList } from "./packingListInterface";

export class PackingList implements IPackingList {
  clothing: PackingCategory = {
    name: "Kleidung",
    content: [],
  };
  toiletries: PackingCategory = {
    name: "Hygiene & Co.",
    content: [],
  };
  gear: PackingCategory = {
    name: "Ausrüstung",
    content: [],
  };
  organisational: PackingCategory = {
    name: "Organisatorisches",
    content: [],
  };
  entertainment: PackingCategory = {
    name: "Unterhaltung",
    content: [],
  };
  other: PackingCategory = {
    name: "sonstiges",
    content: [],
  };

  addPackingList(
    additionalList: IPackingList,
    weatherChoiceKeys?: string[]
  ): void {
    // weather filtering is for now only relevant for clothes and gear
    this.clothing.content = this.clothing.content.concat(
      additionalList.clothing.content.filter((item) => {
        // item is not dependent on weather
        if (!item.relevantForWeather || item.relevantForWeather.length === 0)
          return true;
        // item does depend on weather -> see if itemWeather intersects with weatherChoice for trip
        return (
          item.relevantForWeather.filter((itemWeather) =>
            weatherChoiceKeys?.includes(itemWeather)
          ).length > 0
        );
      })
    );

    this.toiletries.content = this.toiletries.content.concat(
      additionalList.toiletries.content
    );

    this.gear.content = this.gear.content.concat(
      additionalList.gear.content.filter((item) => {
        // item is not dependent on weather
        if (!item.relevantForWeather || item.relevantForWeather.length === 0)
          return true;
        // item does depend on weather -> see if itemWeather intersects with weatherChoice for trip
        return (
          item.relevantForWeather.filter((itemWeather) =>
            weatherChoiceKeys?.includes(itemWeather)
          ).length > 0
        );
      })
    );

    this.organisational.content = this.organisational.content.concat(
      additionalList.organisational.content
    );

    this.entertainment.content = this.entertainment.content.concat(
      additionalList.entertainment.content
    );

    this.other.content = this.other.content.concat(
      additionalList.other.content
    );
  }

  filterForExclusions(
    tripLength: number,
    tripBeginDate: Date,
    isAbroad: boolean
  ) {
    const bTripContainsWeekday = this._checkIfContainsWeekday(
      tripLength,
      tripBeginDate
    );
    [
      this.clothing,
      this.entertainment,
      this.gear,
      this.organisational,
      this.toiletries,
      this.other,
    ].forEach((category: PackingCategory) => {
      const newContent: PackingItem[] = [];
      category.content.forEach((item: PackingItem) => {
        let filteredIn = true;
        filteredIn =
          filteredIn && (!item.dayThreshold || item.dayThreshold <= tripLength);
        filteredIn =
          filteredIn &&
          (!item.onlyIfWeekday || (item.onlyIfWeekday && bTripContainsWeekday));
        filteredIn =
          filteredIn && (!item.onlyIfAbroad || (item.onlyIfAbroad && isAbroad));

        if (!filteredIn) return;

        if (item.dayMultiplier && item.dayMultiplier > 0) {
          const multiplierString = item.dayMultiplier * tripLength + "x ";
          if (item.name.indexOf(item.dayMultiplier * tripLength + "x ") < 0) {
            item.name = item.dayMultiplier * tripLength + "x " + item.name;
          }
        }
        newContent.push(item);
      });
      category.content = newContent;
    });
  }

  removeDuplicates() {
    this.clothing.content = this._filterArrayDuplicates(this.clothing.content);

    this.toiletries.content = this._filterArrayDuplicates(
      this.toiletries.content
    );

    this.gear.content = this._filterArrayDuplicates(this.gear.content);

    this.organisational.content = this._filterArrayDuplicates(
      this.organisational.content
    );

    this.entertainment.content = this._filterArrayDuplicates(
      this.entertainment.content
    );

    this.other.content = this._filterArrayDuplicates(this.other.content);
  }

  _filterArrayDuplicates(items: PackingItem[]): PackingItem[] {
    const keeperObject: any = {};
    return items.filter((item: PackingItem) => {
      if (keeperObject.hasOwnProperty(item.name)) {
        return false;
      } else {
        keeperObject[item.name as keyof {}] = true;
        return true;
      }
    });
  }

  convertToTodoistJSON(
    tripName: string,
    tripLength: number,
    tripBeginDate: Date
  ): any {
    const bTripContainsWeekday = this._checkIfContainsWeekday(
      tripLength,
      tripBeginDate
    );
    return [
      this.clothing,
      this.entertainment,
      this.gear,
      this.organisational,
      this.toiletries,
      this.other,
    ]
      .map((category: PackingCategory) => {
        return {
          task: {
            content: category.name,
          },
          subTasks: category.content.map((item: PackingItem) => {
            if (item.addTripNameToTask) {
              item.name += " für " + tripName;
            }
            let todoistTaskJSON: any = {
              content: item.name,
            };
            if (item.additionalLabels && item.additionalLabels.length > 0) {
              todoistTaskJSON.labels = item.additionalLabels;
            }
            // if afterReturn is true: dueShift = triplength + 1
            if (item.dueShift || item.afterReturn) {
              todoistTaskJSON.dueDate = this._getDueDateString(
                tripBeginDate,
                item.dueShift || tripLength + 1
              );
              // to keep track of related tasks, 'outside' tasks always have the travel label
              todoistTaskJSON.labels = (todoistTaskJSON.labels || []).concat([
                "Reisen",
              ]);
            }

            // remove duplicates
            if (todoistTaskJSON.labels && todoistTaskJSON.labels.length > 0) {
              todoistTaskJSON.labels = [...new Set(todoistTaskJSON.labels)];
            }
            return todoistTaskJSON;
          }),
        };
      })
      .filter((mainTask) => mainTask.subTasks && mainTask.subTasks.length > 0);
  }

  _checkIfContainsWeekday(tripLength: number, tripBeginDate: Date): boolean {
    // longer than 2 days automatically means inclusion of a weekday
    if (tripLength > 2) return true;
    const beginDay = tripBeginDate.getDay();
    // day before saturday (6) is beginDay
    if (beginDay < 5) return true;
    // 2 day trip beginning on sunday is the last remaining option for a weekday to occur
    return beginDay == 0 && tripLength > 1;
  }

  _getDueDateString(tripDate: Date, offset?: number): string {
    offset = offset || -1;
    tripDate.setDate(tripDate.getDate() + offset);
    return tripDate.toISOString().split("T")[0];
  }
}
