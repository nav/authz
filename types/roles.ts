import type { IPermission } from "./permissions";

export interface IRole {
  id: number;
  name: string;
  permissions: IPermission[];
}
