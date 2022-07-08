import { PackingCategory } from "./packingCategory";

export interface IPackingList {
  clothing: PackingCategory;
  toiletries: PackingCategory;
  gear: PackingCategory;
  organisational: PackingCategory;
  entertainment: PackingCategory;
  other: PackingCategory;
}
