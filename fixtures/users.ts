import type { IUser, ILocationRoles, IDepartmentRoles } from "../types/users";
import {
  RequesterRole,
  ApproverRole,
  PurchaserRole,
  ReceiverRole,
} from "./roles";
import { ILocation } from "../types/locations";
import { IDepartment } from "../types/departments";

const VancouverLocation: ILocation = {
  id: 1,
  name: "Vancouver",
  departments: [
    { id: 1, name: "Marketing" },
    { id: 2, name: "Sales" },
    { id: 3, name: "Engineering" },
  ],
};
const TorontoLocation: ILocation = {
  id: 2,
  name: "Toronto",
  departments: [
    { id: 4, name: "Marketing" },
    { id: 5, name: "Sales" },
    { id: 6, name: "Engineering" },
  ],
};
const MontrealLocation: ILocation = {
  id: 3,
  name: "Montreal",
  departments: [
    { id: 7, name: "Marketing" },
    { id: 8, name: "Sales" },
    { id: 9, name: "Engineering" },
  ],
};
const CalgaryLocation: ILocation = {
  id: 4,
  name: "Calgary",
  departments: [
    { id: 10, name: "Marketing" },
    { id: 11, name: "Sales" },
    { id: 12, name: "Engineering" },
  ],
};

export const locations: ILocation[] = [
  VancouverLocation,
  TorontoLocation,
  MontrealLocation,
  CalgaryLocation,
];

export const users: IUser[] = [
  {
    id: 1,
    first_name: "Alice",
    last_name: "Requester",
    email: "alice@example.com",
    position: "Software Developer",
    location_roles: [
      { location: VancouverLocation, roles: [RequesterRole] },
      { location: TorontoLocation, roles: [RequesterRole] },
      { location: MontrealLocation, roles: [RequesterRole] },
      { location: CalgaryLocation, roles: [RequesterRole] },
    ],
  },
  {
    id: 2,
    first_name: "Bob",
    last_name: "Approver",
    email: "bob@example.com",
    position: "Engineering Manager",
    location_roles: [
      { location: VancouverLocation, roles: [RequesterRole, ApproverRole] },
      { location: TorontoLocation, roles: [RequesterRole, ApproverRole] },
    ],
  },
  {
    id: 3,
    first_name: "Charlie",
    last_name: "Purchaser",
    email: "charlier@example.com",
    position: "Office Manager",
    location_roles: [
      { location: VancouverLocation, roles: [PurchaserRole] },
      { location: MontrealLocation, roles: [PurchaserRole] },
    ],
  },
  {
    id: 4,
    first_name: "Doug",
    last_name: "Receiver",
    email: "doug@example.com",
    position: "Warehouse Engineer",
    location_roles: [],
  },
];
