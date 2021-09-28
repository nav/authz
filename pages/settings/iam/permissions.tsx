import { GetServerSideProps } from "next";

import Breadcrumbs from "../../../components/Breadcrumbs";
import { definitions } from "../../../config";
import type { IPermissionDict } from "../../../types/permissions";
import { Permissions } from "../../../components/Permissions";

type IndexProps = {
  permissions: IPermissionDict;
};

export default function Index({ permissions }: IndexProps) {
  const breadcrumbs = [
    { title: "Settings", href: "/" },
    { title: "IAM", href: "/" },
    { title: "Permissions", href: "/settings/iam/permissions" },
  ];

  return (
    <div>
      <Breadcrumbs pieces={breadcrumbs} />
      <Permissions permissions={permissions} />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const permissions_res = await fetch(
    `${definitions.API_SERVER}/api/permissions`
  );
  const permissions_json: any = await permissions_res.json();

  return {
    props: {
      permissions: permissions_json.data,
    },
  };
};
