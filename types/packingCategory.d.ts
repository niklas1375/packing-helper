import { PackingItem } from "./packingItem";

export type PackingCategory = {
    name: string;
    content: PackingItem[];
}