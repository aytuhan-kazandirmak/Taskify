export interface IItem {
  id: string;
  name: string;
}

export interface IGroup {
  id: string;
  name: string;
  items: IItem[];
  tint?: number;
}
