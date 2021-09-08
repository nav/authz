import type { IDepartment } from "./departments";

export interface ILocation {
  id: number;
  name: string;
  departments: IDepartment[];
}
