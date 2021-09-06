import Head from "next/head";
import { GetServerSideProps } from "next";
import * as React from "react";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useDisclosure,
} from "@chakra-ui/react";

import type { IRole } from "../types/roles";
import type { IUser, ILocation } from "../types/users";
import type { IPermissionDict } from "../types/permissions";
import { Users } from "../components/Users";
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
        </TabList>
        <TabPanels>
          <TabPanel>{_users}</TabPanel>
          <TabPanel>{_roles}</TabPanel>
          <TabPanel>{_permissions}</TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const headers = {
    Authorization: `Token ${process.env.ACCESS_TOKEN}`,
  };

  const users_res = await fetch("http://localhost:3001/api/users", {
    headers: headers,
  });
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
