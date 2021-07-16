import type { IRole } from "./roles";

export interface IDepartment {
  id: number;
  name: string;
}

export interface ILocation {
  id: number;
  name: string;
  departments: IDepartment[];
}

export interface ILocationRoles {
  location: ILocation;
  roles: IRole[];
}

export interface IDepartmentRoles {
  department: IDepartment;
  roles: IRole[];
}

export interface IUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  position: string;
  location_roles: ILocationRoles[];
  department_roles?: IDepartmentRoles[];
}
