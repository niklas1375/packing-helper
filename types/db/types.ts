import type { ColumnType, Insertable, Selectable, Updateable } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface PackingItemTable {
  item_id: Generated<string>;
  listId: string;
  name: string;
  category: string;
  dayMultiplier: number | undefined;
  dayThreshold: number | undefined;
  relevantForWeather: string | undefined;
  onlyIfWeekday: number | undefined;
  onlyIfAbroad: number | undefined;
  dueShift: number | undefined;
  afterReturn: number | undefined;
  additionalLabels: string | undefined;
  addTripNameToTask: number | undefined;
  updated_at: Timestamp;
}
export type PackingItem = Selectable<PackingItemTable>;
export type NewPackingItem = Insertable<PackingItemTable>;
export type PackingItemUpdate = Updateable<PackingItemTable>;

export interface PackingListTable {
  id: Generated<string>;
  name: string;
  type: string;
  updated_at: Timestamp;
}
export type PackingList = Selectable<PackingListTable>;
export type NewPackingList = Insertable<PackingListTable>;
export type PackingListUpdate = Updateable<PackingListTable>;

export interface Database {
  PackingItem: PackingItemTable;
  PackingList: PackingListTable;
}
