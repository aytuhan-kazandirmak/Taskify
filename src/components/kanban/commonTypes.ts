export interface IItem {
  boardId: string;
  createdBy: string;
  id: string;
  name: string;
  parentId: string;
}

export interface IGroup {
  boardId: string;
  createdBy: string;
  email: string;
  id: string;
  items: IItem[];
  name: string;
  position?: any;
}

export type IUserInformation = {
  displayName: string;
  email: string;
};
