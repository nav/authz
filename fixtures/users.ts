import type { IUser, ISegmentRoles } from "../types/users";
import {
  RequesterRole,
  ApproverRole,
  PurchaserRole,
  ReceiverRole,
} from "./roles";
import { ISegment } from "../types/segments";

const VancouverSegment: ISegment = {
  id: 1,
  name: "Vancouver",
};
const TorontoSegment: ISegment = {
  id: 2,
  name: "Toronto",
};
const MontrealSegment: ISegment = {
  id: 3,
  name: "Montreal",
};
const CalgarySegment: ISegment = {
  id: 4,
  name: "Calgary",
};

export const segments: ISegment[] = [
  VancouverSegment,
  TorontoSegment,
  MontrealSegment,
  CalgarySegment,
];

export const users: IUser[] = [
  {
    id: 1,
    first_name: "Alice",
    last_name: "Requester",
    email: "alice@example.com",
    position: "Software Developer",
    segment_roles: [
      { segment: VancouverSegment, roles: [RequesterRole] },
      { segment: TorontoSegment, roles: [RequesterRole] },
      { segment: MontrealSegment, roles: [RequesterRole] },
      { segment: CalgarySegment, roles: [RequesterRole] },
    ],
  },
  {
    id: 2,
    first_name: "Bob",
    last_name: "Approver",
    email: "bob@example.com",
    position: "Engineering Manager",
    segment_roles: [
      { segment: VancouverSegment, roles: [RequesterRole, ApproverRole] },
      { segment: TorontoSegment, roles: [RequesterRole, ApproverRole] },
    ],
  },
  {
    id: 3,
    first_name: "Charlie",
    last_name: "Purchaser",
    email: "charlier@example.com",
    position: "Office Manager",
    segment_roles: [
      { segment: VancouverSegment, roles: [PurchaserRole] },
      { segment: MontrealSegment, roles: [PurchaserRole] },
    ],
  },
  {
    id: 4,
    first_name: "Doug",
    last_name: "Receiver",
    email: "doug@example.com",
    position: "Warehouse Engineer",
    segment_roles: [],
  },
];
