import { GetServerSideProps } from "next";

import Breadcrumbs from "../../../../../components/Breadcrumbs";
import { definitions } from "../../../../../config";
import type { IUser } from "../../../../../types/users";
import type { ISegment } from "../../../../../types/segments";
import type { IRole } from "../../../../../types/roles";
import { UserDetail } from "../../../../../components/Users";

type IUserDetailPage = {
  user: IUser;
  segments: ISegment[];
  roles: IRole[];
};

export default function UserDetailPage({
  user,
  segments,
  roles,
}: IUserDetailPage) {
  const breadcrumbs = [
    { title: "Settings", href: "/" },
    { title: "IAM", href: "/" },
    { title: "Users", href: "/settings/iam/users" },
    {
      title: user.first_name + " " + user.last_name,
      href: `/settings/iam/users/${user.id}`,
    },
  ];

  return (
    <>
      <Breadcrumbs pieces={breadcrumbs} />
      <UserDetail user={user} segments={segments} roles={roles} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  const headers = { headers: definitions.API_REQUEST_HEADERS };

  const user_res = await fetch(
    `${definitions.API_SERVER}/api/users/${id}`,
    headers
  );
  const user_json: any = await user_res.json();

  const roles_res = await fetch(`${definitions.API_SERVER}/api/roles`, headers);
  const roles_json: any = await roles_res.json();

  const segments_res = await fetch(
    `${definitions.API_SERVER}/api/segments`,
    headers
  );
  const segments_json: any = await segments_res.json();

  return {
    props: {
      user: user_json.data,
      segments: segments_json.data,
      roles: roles_json.data,
    },
  };
};
