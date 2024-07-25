import { IPackingList } from "./packingListInterface";


export type NamedPackingList = {
    key: string;
    name: string;
    content: IPackingList
}