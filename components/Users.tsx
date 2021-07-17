import NextLink from "next/link";
import { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Divider,
  Heading,
  HStack,
  Link,
  ListItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";

import type { IRole } from "../types/roles";
import type { ILocation, IUser } from "../types/users";
import { Role } from "./Roles";
import { MultiSelect } from "./MultiSelect";
import { Checkbox } from "./Checkbox";
import { pluralize } from "../lib/utils";

type UserProps = {
  user: IUser;
};

function User({ user }: UserProps) {
  const noLocations = user.location_roles.length;
  const noRoles = user.location_roles.reduce(
    (count, loc_rol) => count + loc_rol.roles.length,
    0
  );
  const roles =
    noRoles === 0 && noLocations === 0
      ? "No roles assigned"
      : `${noRoles} roles in ${noLocations} locations`;

  return (
    <Tr>
      <Td>
        <Avatar name={user.first_name + " " + user.last_name} size="sm" />
      </Td>
      <Td>
        {user.first_name} {user.last_name}
      </Td>
      <Td>{user.email}</Td>
      <Td>{user.position}</Td>
      <Td>
        <NextLink href="/">
          <Link>{roles}</Link>
        </NextLink>
      </Td>
    </Tr>
  );
}

type UsersProps = {
  users: IUser[];
};

function Users({ users }: UsersProps) {
  const _users = users.map((user: IUser) => <User key={user.id} user={user} />);

  return (
    <Table variant="simple" size="sm">
      <Thead>
        <Tr>
          <Th w={1}></Th>
          <Th>Name</Th>
          <Th>Email</Th>
          <Th>Position</Th>
          <Th>Roles</Th>
        </Tr>
      </Thead>
      <Tbody>{_users}</Tbody>
    </Table>
  );
}

type AddUserLocationsRolesProps = {
  user: IUser;
  locations: ILocation[];
  roles: IRole[];
};

function AddUserLocationsRoles({
  user,
  locations,
  roles,
}: AddUserLocationsRolesProps) {
  type ILocationRoles = {
    location: ILocation;
    roles: IRole[];
  };
  const [selectionSummary, setSelectionSummary] = useState("");
  const [selectedLocations, setSelectedLocations] = useState<ILocation[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<IRole[]>([]);
  const [locationRoles, setLocationRoles] = useState<ILocationRoles[]>([]);

  useEffect(() => {
    const _locationRoles: ILocationRoles[] = [];
    selectedLocations.forEach((location: ILocation) =>
      _locationRoles.push({ location: location, roles: selectedRoles })
    );
    setLocationRoles(_locationRoles);
    setSelectionSummary(
      `${pluralize(selectedRoles.length, "role")} in ${pluralize(
        selectedLocations.length,
        "location"
      )}`
    );

    user.location_roles = locationRoles;
  }, [selectedLocations, selectedRoles]);

  const rolesMultiSelect =
    selectedLocations.length > 0 ? (
      <MultiSelect
        title="Roles"
        items={roles}
        onSelect={(roles: IRole[]) => setSelectedRoles(roles)}
      />
    ) : null;

  return (
    <VStack spacing={3}>
      <Heading size="md">
        {user.first_name} {user.last_name}
      </Heading>
      <Text>{selectionSummary}</Text>
      <Divider />
      <HStack w="full" align="flex-start">
        <Box w="49%">
          <MultiSelect
            title="Locations"
            items={locations}
            onSelect={(locations: ILocation[]) => {
              setSelectedLocations(locations);
              if (locations.length === 0) {
                setSelectedRoles([]);
              }
            }}
          />
        </Box>
        <Divider orientation="vertical" />
        <Box w="49%">{rolesMultiSelect}</Box>
      </HStack>
    </VStack>
  );
}

type ViewUserLocationsRolesProps = {
  user: IUser;
};

function ViewUserLocationsRoles({ user }: ViewUserLocationsRolesProps) {
  const locations = user.location_roles.map((lr) => (
    <ListItem key={`loc_${lr.location.id}`}>
      {lr.location.name}
      <UnorderedList pb={4}>
        {lr.roles.map((role) => (
          <ListItem key={`role_${lr.location.id}_${role.id}`}>
            <Role role={role} />
          </ListItem>
        ))}
      </UnorderedList>
    </ListItem>
  ));

  return <UnorderedList>{locations}</UnorderedList>;
}

export { Users, AddUserLocationsRoles, ViewUserLocationsRoles };
