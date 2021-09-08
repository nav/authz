import { GetServerSideProps } from "next";
import * as React from "react";
import { Divider, Heading } from "@chakra-ui/react";

import type { IUser } from "../../../../types/users";
import { Users } from "../../../../components/Users";

type IndexProps = {
  users: IUser[];
};

export default function Index({ users }: IndexProps) {
  return (
    <>
      <Heading size="md">Users</Heading>
      <Divider my={5} />
      <Users users={users} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const headers = {
    Authorization: `Token ${process.env.ACCESS_TOKEN}`,
  };

  const users_res = await fetch("http://localhost:3001/api/users", {
    headers: headers,
  });
  const users_json: any = await users_res.json();

  return {
    props: {
      users: users_json.data,
    },
  };
};
