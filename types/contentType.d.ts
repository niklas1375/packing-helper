import { PackingCategory } from "./packingCategory";
import { IPackingList } from "./packingListInterface";

export type ContentType = {
    key: string;
    name: string;
    content: IPackingList;
}