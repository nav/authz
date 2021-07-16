import { permissions as perms } from "./permissions";

export const RequesterRole = {
  id: 1,
  name: "Requester",
  permissions: [
    perms.Request.Order.add_order,
    perms.Request.Order.view_order,
    perms.Request.Order.change_order,
    perms.Request.Order.delete_order,
    perms.Request["Expense Report"].add_expense,
    perms.Request["Expense Report"].view_expense,
    perms.Request["Expense Report"].change_expense,
    perms.Request["Expense Report"].delete_expense,
    perms.Request.Travel.add_travel,
    perms.Request.Travel.view_travel,
    perms.Request.Travel.change_travel,
    perms.Request.Travel.delete_travel,
    perms.Request["Spending Card"].add_spendingcard,
    perms.Procure.Vendor.view_vendor,
    perms.Procure.Catalog.view_catalog,
  ],
};

export const ApproverRole = {
  id: 2,
  name: "Approver",
  permissions: [
    perms.Request.Order.approve_order,
    perms.Request["Expense Report"].approve_expense,
    perms.Request.Travel.approve_travel,
    perms.Request["Spending Card"].approve_spendingcard,
  ],
};

export const PurchaserRole = {
  id: 3,
  name: "Purchaser",
  permissions: [
    perms.Procure["Purchase Order"].add_purchaseorder,
    perms.Procure["Purchase Order"].view_purchaseorder,
    perms.Procure["Purchase Order"].change_purchaseorder,
    perms.Procure["Purchase Order"].delete_purchaseorder,
    perms.Receive.view_receive,
  ],
};

export const ReceiverRole = {
  id: 4,
  name: "Receiver",
  permissions: [
    perms.Procure["Purchase Order"].view_purchaseorder,
    perms.Receive.add_receive,
    perms.Receive.change_receive,
    perms.Receive.delete_Receive,
    perms.Receive.view_receive,
  ],
};

export const roles = [RequesterRole, ApproverRole, PurchaserRole, ReceiverRole];
