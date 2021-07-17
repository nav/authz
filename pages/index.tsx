import Head from "next/head";
import { GetServerSideProps } from "next";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

import type { IRole } from "../types/roles";
import type { IUser, ILocation } from "../types/users";
import type { IPermissionDict } from "../types/permissions";
import {
  Users,
  AddUserLocationsRoles,
  ViewUserLocationsRoles,
} from "../components/Users";
import { Roles } from "../components/Roles";
import { Permissions } from "../components/Permissions";

type IndexProps = {
  roles: IRole[];
  users: IUser[];
  permissions: IPermissionDict;
  locations: ILocation[];
};

export default function Index({
  roles,
  users,
  permissions,
  locations,
}: IndexProps) {
  const _roles = <Roles roles={roles} />;
  const _users = <Users users={users} />;
  const _permissions = <Permissions permissions={permissions} />;

  // // Fake locations and roles
  // const fakeLocations = Array.from({ length: 3000 }, (_, i) => ({
  //   id: i,
  //   name: Math.random().toString(36).substring(2),
  //   departments: [],
  // }));
  // const fakeRoles = Array.from({ length: 10 }, (_, i) => ({
  //   id: i,
  //   name: Math.random().toString(36).substring(2),
  //   permissions: [],
  // }));
  const _view_user_locations_roles = <ViewUserLocationsRoles user={users[2]} />;

  const _add_user_locations_roles = (
    <AddUserLocationsRoles
      user={users[2]}
      locations={locations}
      roles={roles}
    />
  );

  return (
    <>
      <Head>
        <title>Authorization</title>
      </Head>

      <Tabs>
        <TabList>
          <Tab>Users</Tab>
          <Tab>Roles</Tab>
          <Tab>Permissions</Tab>
          <Tab>View User Roles</Tab>
          <Tab>Add User Roles</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>{_users}</TabPanel>
          <TabPanel>{_roles}</TabPanel>
          <TabPanel>{_permissions}</TabPanel>
          <TabPanel>{_view_user_locations_roles}</TabPanel>
          <TabPanel>{_add_user_locations_roles}</TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const users_res = await fetch("http://localhost:3001/api/users");
  const users_json: any = await users_res.json();

  const roles_res = await fetch("http://localhost:3001/api/roles");
  const roles_json: any = await roles_res.json();

  const permissions_res = await fetch("http://localhost:3001/api/permissions");
  const permissions_json: any = await permissions_res.json();

  const locations_res = await fetch("http://localhost:3001/api/locations");
  const locations_json: any = await locations_res.json();

  return {
    props: {
      users: users_json.data,
      roles: roles_json.data,
      permissions: permissions_json.data,
      locations: locations_json.data,
    },
  };
};
