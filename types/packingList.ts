import { PackingCategory } from "./packingCategory";
import { PackingItem } from "./packingItem";
import { IPackingList } from "./packingListInterface";

export class PackingList implements IPackingList {
  clothing!: PackingCategory;
  toiletries!: PackingCategory;
  gear!: PackingCategory;
  organisational!: PackingCategory;
  entertainment!: PackingCategory;
  other!: PackingCategory;

  addPackingList(additionalList: IPackingList): void {
    this.clothing.content = this.clothing.content.concat(
      additionalList.clothing.content
    );

    this.toiletries.content = this.toiletries.content.concat(
      additionalList.toiletries.content
    );

    this.gear.content = this.gear.content.concat(additionalList.gear.content);

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

  convertToTodoistJSON(tripLength: number): any {
    return [
      this.clothing,
      this.entertainment,
      this.gear,
      this.organisational,
      this.toiletries,
      this.other,
    ].map((category: PackingCategory) => {
      return {
        task: {
          content: category.name,
        },
        subTasks: category.content.map((item: PackingItem) => {
          // TODO: Day modifier mit Trip Länge kombinieren
          const taskString =
            item.dayModifier && item.dayModifier > 0
              ? item.dayModifier * tripLength + "x " + item.name
              : item.name;
          return {
            content: taskString
          };
        }),
      };
    }).filter(mainTask => (mainTask.subTasks && mainTask.subTasks.length > 0));
  }
}
