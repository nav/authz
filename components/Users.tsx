import NextLink from "next/link";
import * as React from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerContent,
  DrawerCloseButton,
  HStack,
  Link,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";

import type { IRole } from "../types/roles";
import type { ILocation } from "../types/locations";
import type { IUser } from "../types/users";
import { Role } from "./Roles";
import { Checkbox } from "./Checkbox";
import { MultiSelect } from "./MultiSelect";
import { pluralize } from "../lib/utils";
import { Card } from "./Card/Card";
import { CardContent } from "./Card/CardContent";
import { CardHeader } from "./Card/CardHeader";
import { Property } from "./Card/Property";

type IUserDetail = {
  user: IUser;
  locations: ILocation[];
  roles: IRole[];
};

type ILocationRoles = {
  location: ILocation;
  roles: IRole[];
};

/**
 * Convert LocationRoles to a map containing ids for easy manipulation.
 *
 * @param {ILocationRoles[]} locationRoles  Location roles to be convered
 * @return {[id: number]: number[]}
 */
const locationRolesToMap = (locationRoles: ILocationRoles[]) => {
  const map: { [id: number]: number[] } = {};
  locationRoles.forEach((lr) => {
    map[lr.location.id] = lr.roles.map((r) => r.id);
  });
  return map;
};

/**
 * Convert a map containing location and role ids to array of location roles.
 * @param {ILocation[]} locations   Source array of locations.
 * @param {IRole[]}     roles       Source array of roles.
 * @param {[id: number]: number[]}  Map of location id and role ids.
 * @return {ILocationRoles[]}
 */
const mapToLocationRoles = (
  locations: ILocation[],
  roles: IRole[],
  locationRolesMap: { [id: number]: number[] }
) => {
  const locationsMap: { [id: number]: ILocation } = {};
  locations.map((l) => (locationsMap[l.id] = l));

  const rolesMap: { [id: number]: IRole } = {};
  roles.map((r) => (rolesMap[r.id] = r));

  const locationRoles = [];
  for (const locationId in locationRolesMap) {
    const roles = locationRolesMap[locationId];
    roles.sort();
    if (roles.length > 0) {
      locationRoles.push({
        location: locationsMap[locationId],
        roles: locationRolesMap[locationId].map((roleId) => rolesMap[roleId]),
      });
    }
  }

  return locationRoles;
};

/**
 * Merge the existing and new roles. Merge process is additive and does not
 * remove existing roles.
 *
 * @param  {ILocationRoles[]} existingLocationRoles User's existing location roles.
 * @param  {ILocationRoles[]} newLocationRoles      New roles being added to user.
 * @return {[id: number]: number[]}
 */
const mergeRoles = (
  existingLocationRoles: ILocationRoles[],
  newLocationRoles: ILocationRoles[]
) => {
  const existingLocationRolesMap = locationRolesToMap(existingLocationRoles);
  const newLocationRolesMap = locationRolesToMap(newLocationRoles);

  for (const locationId in existingLocationRolesMap) {
    if (locationId in newLocationRolesMap) {
      const roleSet = new Set(existingLocationRolesMap[locationId]);
      newLocationRolesMap[locationId].map((rid) => roleSet.add(rid));
      delete newLocationRolesMap[locationId];
      existingLocationRolesMap[locationId] = Array.from(roleSet);
    }
  }

  if (Object.keys(newLocationRolesMap).length > 0) {
    return Object.assign(existingLocationRolesMap, newLocationRolesMap);
  }

  return existingLocationRolesMap;
};

function UserDetail({ user, locations, roles }: IUserDetail) {
  const {
    isOpen: isEditModeOpen,
    onOpen: onEditModeOpen,
    onClose: onEditModeClose,
  } = useDisclosure();

  const {
    isOpen: isAddRolesOpen,
    onOpen: onAddRolesOpen,
    onClose: onAddRolesClose,
  } = useDisclosure();

  const [userState, setUserState] = React.useState<IUser>(user);
  const [userLocationRolesState, setUserLocationRolesState] = React.useState<
    ILocationRoles[]
  >(user.location_roles);

  const [locationRolesToBeAdded, setLocationRolesToBeAdded] = React.useState<
    ILocationRoles[]
  >([]);

  const addRolesDrawer = (
    <Drawer isOpen={isAddRolesOpen} onClose={onAddRolesClose} size="lg">
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Add Roles</DrawerHeader>
        <DrawerBody>
          <AddUserLocationsRoles
            locations={locations}
            roles={roles}
            onAdd={(locationRoles: ILocationRoles[]) =>
              setLocationRolesToBeAdded(locationRoles)
            }
          />
        </DrawerBody>
        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onAddRolesClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={() => {
              userState.location_roles = mapToLocationRoles(
                locations,
                roles,
                mergeRoles(userState.location_roles, locationRolesToBeAdded)
              );
              onAddRolesClose();
            }}
          >
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );

  return (
    <>
      {addRolesDrawer}
      <Tabs>
        <TabList>
          <Tab>Profile</Tab>
          <Tab>Location Roles</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Box as="section" py="12" px={{ md: "8" }}>
              <Card maxW="3xl" mx="auto">
                <CardHeader title="Account Info" action={null} />
                <CardContent>
                  <Property
                    label="Name"
                    value={userState.first_name + " " + userState.last_name}
                  />
                  <Property label="Email" value={userState.email} />
                  <Property label="Position" value={userState.position} />
                </CardContent>
              </Card>
            </Box>
          </TabPanel>

          <TabPanel>
            <Box as="section" py="12" px={{ md: "8" }}>
              <Card maxW="3xl" mx="auto">
                <CardHeader
                  title="Location Roles"
                  action={
                    <>
                      {isEditModeOpen ? (
                        <>
                          <Button variant="outline" onClick={onEditModeClose}>
                            Cancel
                          </Button>{" "}
                          <Button
                            onClick={() => {
                              user.location_roles = userLocationRolesState;
                              setUserState({ ...user });
                              onEditModeClose();
                            }}
                          >
                            Save
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={onEditModeOpen}
                          variant="outline"
                          minW="20"
                        >
                          Edit
                        </Button>
                      )}
                      <Button onClick={onAddRolesOpen}>Add Roles</Button>
                    </>
                  }
                />
                <CardContent>
                  <ViewUserLocationsRoles
                    user={userState}
                    locations={locations}
                    roles={roles}
                    isEditMode={isEditModeOpen}
                    onRemove={(locationRoles) => {
                      setUserLocationRolesState(locationRoles);
                    }}
                  />
                </CardContent>
              </Card>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}

type IUserRow = {
  user: IUser;
};

function UserRow({ user }: IUserRow) {
  const locationRoles = user.location_roles;
  const allRoles: IRole[] = [];
  locationRoles.map((lr) => allRoles.push(...lr.roles));
  const roles = new Set<IRole>(allRoles);

  const _roles =
    roles.size === 0 && locationRoles.length === 0
      ? "No roles assigned"
      : `${roles.size} roles in ${locationRoles.length} locations`;

  return (
    <Tr>
      <Td>
        <Avatar name={user.first_name + " " + user.last_name} size="sm" />
      </Td>
      <Td>
        <NextLink href={`/settings/iam/users/${user.id}`} passHref>
          <Link>
            {user.first_name} {user.last_name}
          </Link>
        </NextLink>
      </Td>
      <Td>{user.email}</Td>
      <Td>{user.position}</Td>
      <Td>{_roles}</Td>
    </Tr>
  );
}

type IUsers = {
  users: IUser[];
};

function Users({ users }: IUsers) {
  const _users = users.map((user: IUser) => (
    <UserRow key={user.id} user={user} />
  ));

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

type IAddUserLocationsRoles = {
  locations: ILocation[];
  roles: IRole[];
  onAdd: (locationRoles: ILocationRoles[]) => void;
};

function AddUserLocationsRoles({
  locations,
  roles,
  onAdd,
}: IAddUserLocationsRoles) {
  const [selectionSummary, setSelectionSummary] = React.useState("");
  const [selectedLocations, setSelectedLocations] = React.useState<ILocation[]>(
    []
  );
  const [selectedRoles, setSelectedRoles] = React.useState<IRole[]>([]);

  React.useEffect(() => {
    const _locationRoles: ILocationRoles[] = [];
    selectedLocations.forEach((location: ILocation) =>
      _locationRoles.push({ location: location, roles: selectedRoles })
    );
    onAdd(_locationRoles);
    setSelectionSummary(
      `${pluralize(selectedRoles.length, "role")} in ${pluralize(
        selectedLocations.length,
        "location"
      )}`
    );
  }, [selectedLocations, selectedRoles]);

  const isLocationRolesMultiSelectDisabled = selectedLocations.length === 0;

  return (
    <VStack spacing={3}>
      <HStack w="full" align="flex-start">
        <Box w="49%">
          <MultiSelect
            title="Locations"
            items={locations}
            onSelect={(_locations: ILocation[]) => {
              setSelectedLocations(_locations);
              if (_locations.length === 0) {
                setSelectedRoles([]);
              }
            }}
          />
        </Box>
        <Divider orientation="vertical" />
        <Box w="49%">
          <MultiSelect
            title="Roles"
            items={roles}
            isDisabled={isLocationRolesMultiSelectDisabled}
            onSelect={(_roles: IRole[]) => setSelectedRoles(_roles)}
          />
        </Box>
      </HStack>
    </VStack>
  );
}

type IViewUserLocationsRoles = {
  user: IUser;
  locations: ILocation[];
  roles: IRole[];
  isEditMode: boolean;
  onRemove: (locationRoles: ILocationRoles[]) => void;
};

function ViewUserLocationsRoles({
  user,
  locations,
  roles,
  isEditMode,
  onRemove,
}: IViewUserLocationsRoles) {
  const [state, setState] = React.useState<any>({});
  React.useEffect(() => {
    setState(locationRolesToMap(user.location_roles));
  }, [user.location_roles]);

  const render = user.location_roles.map((lr) => (
    <Property
      key={`loc_${lr.location.id}`}
      label={isEditMode ? <Box>{lr.location.name}</Box> : lr.location.name}
      value={
        <HStack spacing={6}>
          {lr.roles.map((role) =>
            isEditMode ? (
              <Box>
                <Checkbox
                  key={`lr_${lr.location.id}_${role.id}`}
                  id={`lr_${lr.location.id}_${role.id}`}
                  checked={
                    typeof state[lr.location.id] !== "undefined"
                      ? state[lr.location.id]?.includes(role.id)
                      : false
                  }
                  onChange={(e: React.SyntheticEvent) => {
                    const target = e.target as HTMLInputElement;
                    if (!target.checked) {
                      state[lr.location.id] = state[lr.location.id].filter(
                        (r: number) => r != role.id
                      );
                    } else {
                      const roleSet = new Set(state[lr.location.id]);
                      roleSet.add(role.id);
                      state[lr.location.id] = Array.from(roleSet);
                    }
                    setState({ ...state });
                    onRemove(mapToLocationRoles(locations, roles, state));
                  }}
                >
                  {role.name}
                </Checkbox>
              </Box>
            ) : (
              <Box>{role.name}</Box>
            )
          )}
        </HStack>
      }
    />
  ));

  return <div>{render}</div>;
}

export { Users, UserDetail, AddUserLocationsRoles, ViewUserLocationsRoles };
