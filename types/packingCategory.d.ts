import { PackingItem } from "./packingItem";

export type PackingCategory = {
    key: string;
    name: string;
    content: PackingItem[];
}