export interface IItem {
  createdBy: string;
  id: string;
  name: string;
  parentId: string;
  position?: any;
}

export interface IGroup {
  createdBy: string;
  email: string;
  id: string;
  items: IItem[];
  name: string;
  position?: any;
}
