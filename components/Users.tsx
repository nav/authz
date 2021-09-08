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

import { definitions } from "../config";
import type { IRole } from "../types/roles";
import type { ISegment } from "../types/segments";
import type { IUser } from "../types/users";
import { Checkbox } from "./Checkbox";
import { MultiSelect } from "./MultiSelect";
import { Card } from "./Card/Card";
import { CardContent } from "./Card/CardContent";
import { CardHeader } from "./Card/CardHeader";
import { Property } from "./Card/Property";

type IUserDetail = {
  user: IUser;
  segments: ISegment[];
  roles: IRole[];
};

type ISegmentRoles = {
  segment: ISegment;
  roles: IRole[];
};

type ISegmentRolesMap = {
  [id: number]: number[];
};

/**
 * Convert SegmentRoles to a map containing ids for easy manipulation.
 *
 * @param {ISegmentRoles[]} segmentRoles  Segment roles to be convered
 * @return {[id: number]: number[]}
 */
const segmentRolesToMap = (segmentRoles: ISegmentRoles[]) => {
  const map: ISegmentRolesMap = {};
  segmentRoles.forEach((lr) => {
    map[lr.segment.id] = lr.roles.map((r) => r.id);
  });
  return map;
};

/**
 * Convert a map containing segment and role ids to array of segment roles.
 * @param {ISegment[]} segments   Source array of segments.
 * @param {IRole[]}     roles       Source array of roles.
 * @param {ISegmentRolesMap}        Map of segment id and role ids.
 * @return {ISegmentRoles[]}
 */
const mapToSegmentRoles = (
  segments: ISegment[],
  roles: IRole[],
  segmentRolesMap: ISegmentRolesMap
) => {
  const segmentsMap: { [id: number]: ISegment } = {};
  segments.map((l) => (segmentsMap[l.id] = l));

  const rolesMap: { [id: number]: IRole } = {};
  roles.map((r) => (rolesMap[r.id] = r));

  const segmentRoles = [];
  for (const segmentId in segmentRolesMap) {
    const roles = segmentRolesMap[segmentId];
    roles.sort(); // Keep roles display consistent.
    if (roles.length > 0) {
      segmentRoles.push({
        segment: segmentsMap[segmentId],
        roles: segmentRolesMap[segmentId].map((roleId) => rolesMap[roleId]),
      });
    }
  }

  return segmentRoles;
};

/**
 * Merge the existing and new roles. Merge process is additive and does not
 * remove existing roles.
 *
 * @param  {ISegmentRoles[]} existingSegmentRoles User's existing segment roles.
 * @param  {ISegmentRoles[]} newSegmentRoles      New roles being added to user.
 * @return {[id: number]: number[]}
 */
const mergeRoles = (
  existingSegmentRoles: ISegmentRoles[],
  newSegmentRoles: ISegmentRoles[]
) => {
  const existingSegmentRolesMap = segmentRolesToMap(existingSegmentRoles);
  const newSegmentRolesMap = segmentRolesToMap(newSegmentRoles);

  for (const segmentId in existingSegmentRolesMap) {
    if (segmentId in newSegmentRolesMap) {
      const roleSet = new Set(existingSegmentRolesMap[segmentId]);
      newSegmentRolesMap[segmentId].map((rid) => roleSet.add(rid));
      delete newSegmentRolesMap[segmentId];
      existingSegmentRolesMap[segmentId] = Array.from(roleSet);
    }
  }

  if (Object.keys(newSegmentRolesMap).length > 0) {
    return Object.assign(existingSegmentRolesMap, newSegmentRolesMap);
  }

  return existingSegmentRolesMap;
};

function UserDetail({ user, segments, roles }: IUserDetail) {
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

  const [segmentRolesToBeAdded, setSegmentRolesToBeAdded] = React.useState<
    ISegmentRoles[]
  >([]);

  const [segmentRolesToBeRemoved, setSegmentRolesToBeRemoved] =
    React.useState<ISegmentRolesMap>({});

  const addSegmentRoles = (segmentRolesToBeAdded: ISegmentRoles[]) => {
    const newSegmentRolesMap = mergeRoles(
      userState.segment_roles,
      segmentRolesToBeAdded
    );
    userState.segment_roles = mapToSegmentRoles(
      segments,
      roles,
      newSegmentRolesMap
    );
    setUserState({ ...userState });
  };

  const removeSegmentRoles = (toBeRemovedsegmentRolesMap: ISegmentRolesMap) => {
    const existingSegmentRolesMap = segmentRolesToMap(userState.segment_roles);
    for (const segmentId in toBeRemovedsegmentRolesMap) {
      const rolesToBeRemoved = new Set(toBeRemovedsegmentRolesMap[segmentId]);
      if (
        rolesToBeRemoved.size > 0 &&
        typeof existingSegmentRolesMap[segmentId] !== "undefined"
      ) {
        const remainingRoles = new Set(
          [...existingSegmentRolesMap[segmentId]].filter(
            (r) => !rolesToBeRemoved.has(r)
          )
        );
        existingSegmentRolesMap[segmentId] = Array.from(remainingRoles);
      }
    }
    userState.segment_roles = mapToSegmentRoles(
      segments,
      roles,
      existingSegmentRolesMap
    );
    setUserState({ ...userState });
  };

  const addRolesDrawer = (
    <Drawer isOpen={isAddRolesOpen} onClose={onAddRolesClose} size="xl">
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Add Roles</DrawerHeader>
        <DrawerBody>
          <AddUserSegmentsRoles
            segments={segments}
            roles={roles}
            onAdd={(segmentRoles: ISegmentRoles[]) =>
              setSegmentRolesToBeAdded(segmentRoles)
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
              addSegmentRoles(segmentRolesToBeAdded);
              onAddRolesClose();
            }}
          >
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );

  const segmentRolesLabel = `${definitions.SEGMENT_NAME} Roles`;

  return (
    <>
      {addRolesDrawer}
      <Tabs>
        <TabList>
          <Tab>Profile</Tab>
          <Tab>{segmentRolesLabel}</Tab>
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
                  title={segmentRolesLabel}
                  action={
                    <>
                      {isEditModeOpen ? (
                        <>
                          <Button variant="outline" onClick={onEditModeClose}>
                            Cancel
                          </Button>{" "}
                          <Button
                            onClick={() => {
                              removeSegmentRoles(segmentRolesToBeRemoved);
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
                  <ViewUserSegmentsRoles
                    user={userState}
                    isEditMode={isEditModeOpen}
                    onRemove={(userSegmentRolesTobeRemoved) => {
                      setSegmentRolesToBeRemoved(userSegmentRolesTobeRemoved);
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
  const segmentRoles = user.segment_roles;
  const allRoles: IRole[] = [];
  segmentRoles.map((lr) => allRoles.push(...lr.roles));
  const roles = new Set<IRole>(allRoles);

  const _roles =
    roles.size === 0 && segmentRoles.length === 0
      ? "No roles assigned"
      : `${roles.size} roles in ${
          segmentRoles.length
        } ${definitions.SEGMENT_NAME_PLURAL?.toLowerCase()}`;

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

type IAddUserSegmentsRoles = {
  segments: ISegment[];
  roles: IRole[];
  onAdd: (segmentRoles: ISegmentRoles[]) => void;
};

function AddUserSegmentsRoles({
  segments,
  roles,
  onAdd,
}: IAddUserSegmentsRoles) {
  const [selectedSegments, setSelectedSegments] = React.useState<ISegment[]>(
    []
  );
  const [selectedRoles, setSelectedRoles] = React.useState<IRole[]>([]);

  const isSegmentRolesMultiSelectDisabled = selectedSegments.length === 0;

  const buildSegmentRoles = (segments: ISegment[], roles: IRole[]) => {
    const segmentRoles: ISegmentRoles[] = [];
    segments.forEach((segment: ISegment) =>
      segmentRoles.push({ segment: segment, roles: roles })
    );
    onAdd(segmentRoles);
  };

  return (
    <VStack spacing={3}>
      <HStack w="full" align="flex-start">
        <Box w="49%">
          <MultiSelect
            title={definitions.SEGMENT_NAME_PLURAL}
            items={segments}
            onSelect={(_segments: ISegment[]) => {
              setSelectedSegments(_segments);
              if (_segments.length === 0) {
                setSelectedRoles([]);
              }
              buildSegmentRoles(_segments, selectedRoles);
            }}
          />
        </Box>
        <Divider orientation="vertical" />
        <Box w="49%">
          <MultiSelect
            title="Roles"
            items={roles}
            isDisabled={isSegmentRolesMultiSelectDisabled}
            onSelect={(_roles: IRole[]) => {
              setSelectedRoles(_roles);
              buildSegmentRoles(selectedSegments, _roles);
            }}
          />
        </Box>
      </HStack>
    </VStack>
  );
}

type IViewUserSegmentsRoles = {
  user: IUser;
  isEditMode: boolean;
  onRemove: (userSegmentRolesMap: ISegmentRolesMap) => void;
};

function ViewUserSegmentsRoles({
  user,
  isEditMode,
  onRemove,
}: IViewUserSegmentsRoles) {
  const [rolesToBeRemoved, setRolesToBeRemoved] =
    React.useState<ISegmentRolesMap>({});

  const _addRole = (segmentId: number, roleId: number) => {
    if (!(segmentId in rolesToBeRemoved)) {
      rolesToBeRemoved[segmentId] = [];
    }
    rolesToBeRemoved[segmentId].push(roleId);
  };

  const _removeRole = (segmentId: number, roleId: number) => {
    const roles = rolesToBeRemoved[segmentId].filter((r) => r !== roleId);
    rolesToBeRemoved[segmentId] = roles;
  };

  const handleChange = (
    isChecked: boolean,
    segmentId: number,
    roleId: number
  ) => {
    !isChecked ? _addRole(segmentId, roleId) : _removeRole(segmentId, roleId);
    setRolesToBeRemoved({ ...rolesToBeRemoved });
    onRemove(rolesToBeRemoved);
  };

  const render = user.segment_roles.map((lr) => (
    <Property
      key={`loc_${lr.segment.id}`}
      label={isEditMode ? <Box>{lr.segment.name}</Box> : lr.segment.name}
      value={
        <HStack spacing={6}>
          {lr.roles.map((role) =>
            isEditMode ? (
              <Box>
                <Checkbox
                  key={`lr_${lr.segment.id}_${role.id}`}
                  id={`lr_${lr.segment.id}_${role.id}`}
                  checked={
                    typeof rolesToBeRemoved[lr.segment.id] === "undefined"
                      ? true
                      : !rolesToBeRemoved[lr.segment.id]?.includes(role.id)
                  }
                  onChange={(e: React.SyntheticEvent) => {
                    const target = e.target as HTMLInputElement;
                    handleChange(target.checked, lr.segment.id, role.id);
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

export { Users, UserDetail };
