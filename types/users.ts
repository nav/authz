import type { IRole } from "./roles";
import type { ISegment } from "./segments";

export interface ISegmentRoles {
  segment: ISegment;
  roles: IRole[];
}

export interface IUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  position: string;
  segment_roles: ISegmentRoles[];
}
