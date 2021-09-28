import { GetServerSideProps } from "next";

import Breadcrumbs from "../../../components/Breadcrumbs";
import { definitions } from "../../../config";
import type { IRole } from "../../../types/roles";
import { Roles } from "../../../components/Roles";

type IndexProps = {
  roles: IRole[];
};

export default function Index({ roles }: IndexProps) {
  const breadcrumbs = [
    { title: "Settings", href: "/" },
    { title: "IAM", href: "/" },
    { title: "Roles", href: "/settings/iam/roles" },
  ];

  return (
    <div>
      <Breadcrumbs pieces={breadcrumbs} />
      <Roles roles={roles} />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const roles_res = await fetch(`${definitions.API_SERVER}/api/roles`);
  const roles_json: any = await roles_res.json();

  return {
    props: {
      roles: roles_json.data,
    },
  };
};
