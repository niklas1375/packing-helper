import { PackingCategory } from "./packingCategory";
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

    this.gear.content = this.gear.content.concat(
      additionalList.gear.content
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

  convertToTodoistJSON(): any {} // any just for now -> from lib?
}
