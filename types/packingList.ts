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

  convertToTodoistJSON(tripLength: number): any {
    return [
      this.clothing,
      this.entertainment,
      this.gear,
      this.organisational,
      this.toiletries,
      this.other,
    ]
      .map((category: PackingCategory) => {
        category.content = category.content.filter(
          (item: PackingItem) =>
            !item.dayThreshold || item.dayThreshold <= tripLength
        );
        return {
          task: {
            content: category.name,
          },
          subTasks: category.content.map((item: PackingItem) => {
            const taskString =
              item.dayMultiplier && item.dayMultiplier > 0
                ? item.dayMultiplier * tripLength + "x " + item.name
                : item.name;
            return {
              content: taskString,
            };
          }),
        };
      })
      .filter((mainTask) => mainTask.subTasks && mainTask.subTasks.length > 0);
  }
}
