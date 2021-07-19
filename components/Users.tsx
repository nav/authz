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
  DrawerOverlay,
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

function UserDetail({ user, locations, roles }: IUserDetail) {
  const {
    isOpen: isAddRolesOpen,
    onOpen: onAddRolesOpen,
    onClose: onAddRolesClose,
  } = useDisclosure();

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
            user={user}
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
              // TODO(nav): Merge new roles with existing
              user.location_roles = locationRolesToBeAdded;
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
          <Tab>Roles</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Box as="section" py="12" px={{ md: "8" }}>
              <Card maxW="3xl" mx="auto">
                <CardHeader
                  title="Account Info"
                  action={
                    <Button variant="outline" minW="20">
                      Edit
                    </Button>
                  }
                />
                <CardContent>
                  <Property
                    label="Name"
                    value={user.first_name + " " + user.last_name}
                  />
                  <Property label="Email" value={user.email} />
                  <Property label="Position" value={user.position} />
                </CardContent>
              </Card>
            </Box>
          </TabPanel>

          <TabPanel>
            <Box as="section" py="12" px={{ md: "8" }}>
              <Card maxW="3xl" mx="auto">
                <CardHeader
                  title="Roles"
                  action={
                    <>
                      <Button variant="outline" minW="20">
                        Edit
                      </Button>
                      <Button onClick={onAddRolesOpen}>Add Roles</Button>
                    </>
                  }
                />
                <CardContent>
                  <ViewUserLocationsRoles user={user} />
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
  user: IUser;
  locations: ILocation[];
  roles: IRole[];
  onAdd: (locationRoles: ILocationRoles[]) => void;
};

function AddUserLocationsRoles({
  user,
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
      <Text
        w="full"
        py={2}
        borderBottom="1px"
        borderColor="var(--chakra-colors-gray-200);"
        textAlign="center"
      >
        {selectionSummary}
      </Text>
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
        <Box w="49%">
          <MultiSelect
            title="Roles"
            items={roles}
            isDisabled={isLocationRolesMultiSelectDisabled}
            onSelect={(roles: IRole[]) => setSelectedRoles(roles)}
          />
        </Box>
      </HStack>
    </VStack>
  );
}

type IViewUserLocationsRoles = {
  user: IUser;
};

function ViewUserLocationsRoles({ user }: IViewUserLocationsRoles) {
  const locations = user.location_roles.map((lr) => (
    <Property
      key={`loc_${lr.location.id}`}
      label={lr.location.name}
      value="Roles"
    />
  ));
  return locations;
}

export { Users, UserDetail, AddUserLocationsRoles, ViewUserLocationsRoles };
