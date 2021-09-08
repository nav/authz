import type { IRole } from "./roles";
import type { IDepartment } from "./departments";
import type { ILocation } from "./locations";

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
