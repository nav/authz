export interface IPermission {
  id: number;
  codename: string;
  description: string;
}

export interface IPermissionDict {
  [index: string]: IPermission;
}

export interface IPermissions {
  [index: string]: IPermissions | IPermissionDict;
}
