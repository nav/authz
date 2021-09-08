import { GetServerSideProps } from "next";
import { Divider, Heading } from "@chakra-ui/react";

import type { IPermissionDict } from "../../../types/permissions";
import { Permissions } from "../../../components/Permissions";

type IndexProps = {
  permissions: IPermissionDict;
};

export default function Index({ permissions }: IndexProps) {
  return (
    <>
      <Heading size="md">Permissions</Heading>
      <Divider my={5} /> <Permissions permissions={permissions} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const permissions_res = await fetch("http://localhost:3001/api/permissions");
  const permissions_json: any = await permissions_res.json();

  return {
    props: {
      permissions: permissions_json.data,
    },
  };
};
