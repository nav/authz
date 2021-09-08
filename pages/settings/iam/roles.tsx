import { GetServerSideProps } from "next";
import { Divider, Heading } from "@chakra-ui/react";

import type { IRole } from "../../../types/roles";
import { Roles } from "../../../components/Roles";

type IndexProps = {
  roles: IRole[];
};

export default function Index({ roles }: IndexProps) {
  return (
    <>
      <Heading size="md">Roles</Heading>
      <Divider my={5} />
      <Roles roles={roles} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const roles_res = await fetch("http://localhost:3001/api/roles");
  const roles_json: any = await roles_res.json();

  return {
    props: {
      roles: roles_json.data,
    },
  };
};
