import NextLink from "next/link";
import { GetServerSideProps } from "next";
import * as React from "react";
import Breadcrumbs from "../../../../components/Breadcrumbs";

import { definitions } from "../../../../config";
import type { IRole } from "../../../../types/roles";
import type { ISegment } from "../../../../types/segments";
import type { IUser } from "../../../../types/users";

type UserRowProps = {
  user: IUser;
  isEven: boolean;
};

function UserRow({ user, isEven }: UserRowProps) {
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

  const initials =
    user.first_name.substring(0, 1) + " " + user.last_name.substring(0, 1);

  const name = user.first_name + " " + user.last_name;

  return (
    <tr className={isEven ? "bg-white" : "bg-gray-50"}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 underline">
        <NextLink href={`/settings/iam/users/${user.id}`} passHref>
          {name}
        </NextLink>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {user.email}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {user.position}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {_roles}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <a href="#" className="text-indigo-600 hover:text-indigo-900">
          Edit
        </a>
      </td>
    </tr>
  );
}

type IndexProps = {
  users: IUser[];
};

export default function Index({ users }: IndexProps) {
  const breadcrumbs = [
    { title: "Settings", href: "/" },
    { title: "IAM", href: "/" },
    { title: "Users", href: "/settings/iam/users" },
  ];

  const _users = users.map((user: IUser, index: number) => (
    <UserRow key={user.id} user={user} isEven={index % 2 === 0} />
  ));

  return (
    <div>
      <Breadcrumbs pieces={breadcrumbs} />
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Enail
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Position
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Roles
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody>{_users}</tbody>
      </table>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const headers = {
    Authorization: `Token ${process.env.ACCESS_TOKEN}`,
  };

  const users_res = await fetch(`${definitions.API_SERVER}/api/users`, {
    headers: headers,
  });
  const users_json: any = await users_res.json();

  return {
    props: {
      users: users_json.data,
    },
  };
};
