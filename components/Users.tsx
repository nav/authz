import * as React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";

import { definitions } from "../config";
import type { IRole } from "../types/roles";
import type { ISegment } from "../types/segments";
import type { IUser } from "../types/users";
import { Checkbox } from "./Checkbox";
import { MultiSelect } from "./MultiSelect";

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
 * @param {ISegment[]}  segments    Source array of segments.
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
  const [isEditModeOpen, setEditModeOpen] = React.useState(false);
  const [isAddRolesOpen, setAddRolesOpen] = React.useState(false);
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
    <Transition.Root show={isAddRolesOpen} as={React.Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-hidden"
        onClose={setAddRolesOpen}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Dialog.Overlay className="absolute inset-0" />

          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex sm:pl-16">
            <Transition.Child
              as={React.Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="w-screen max-w-3xl">
                <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
                  <div className="px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <Dialog.Title className="text-lg font-medium text-gray-900">
                        Add Roles
                      </Dialog.Title>
                      <div className="ml-3 h-7 flex items-center">
                        <button
                          type="button"
                          className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          onClick={() => setAddRolesOpen(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 relative flex-1 px-4 sm:px-6">
                    <AddUserSegmentsRoles
                      segments={segments}
                      roles={roles}
                      onAdd={(segmentRoles: ISegmentRoles[]) =>
                        setSegmentRolesToBeAdded(segmentRoles)
                      }
                    />
                  </div>

                  <div className="flex-shrink-0 px-4 py-4 flex justify-end">
                    <button
                      type="button"
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => setAddRolesOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="ml-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => {
                        addSegmentRoles(segmentRolesToBeAdded);
                        setAddRolesOpen(false);
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );

  const segmentRolesLabel = `${definitions.SEGMENT_NAME} Roles`;

  return (
    <>
      {addRolesDrawer}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-8 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {userState.first_name + " " + userState.last_name}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-8 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {userState.email}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-8 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Position</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {userState.position}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-8 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                {segmentRolesLabel}
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-7">
                <div className="sm:flex sm:gap-3 sm:justify-end ">
                  {isEditModeOpen ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setEditModeOpen(false)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => {
                          removeSegmentRoles(segmentRolesToBeRemoved);
                          setEditModeOpen(false);
                        }}
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => setEditModeOpen(true)}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => setAddRolesOpen(true)}
                  >
                    Add Roles
                  </button>
                </div>
              </dd>
            </div>

            <div className="p-6 pt-0 border-none">
              <ViewUserSegmentsRoles
                user={userState}
                isEditMode={isEditModeOpen}
                onRemove={(userSegmentRolesTobeRemoved) => {
                  setSegmentRolesToBeRemoved(userSegmentRolesTobeRemoved);
                }}
              />
            </div>
          </dl>
        </div>
      </div>
    </>
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
    <div className="flex gap-4">
      <div className="flex-1">
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
      </div>
      <div className="flex-1">
        <MultiSelect
          title="Roles"
          items={roles}
          isDisabled={isSegmentRolesMultiSelectDisabled}
          onSelect={(_roles: IRole[]) => {
            setSelectedRoles(_roles);
            buildSegmentRoles(selectedSegments, _roles);
          }}
        />
      </div>
    </div>
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
    <div
      key={`loc_${lr.segment.id}`}
      className="py-2 sm:py-3 sm:grid sm:grid-cols-8 sm:gap-4 sm:px-6"
    >
      <dt className="text-sm font-medium text-gray-500">
        {isEditMode ? <div>{lr.segment.name}</div> : lr.segment.name}
      </dt>

      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-7 flex">
        {lr.roles.map((role) =>
          isEditMode ? (
            <div className="mx-6">
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
            </div>
          ) : (
            <div className="mx-6">{role.name}</div>
          )
        )}
      </dd>
    </div>
  ));

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <dl className="sm:divide-y sm:divide-gray-200">{render}</dl>
    </div>
  );
}

export { UserDetail };
