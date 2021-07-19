import { GetServerSideProps } from "next";
import { definitions } from "../../../../config";
import type { IUser } from "../../../../types/users";
import { Users } from "../../../../components/Users";

type IUsersPage = {
  users: IUser[];
};

export default function UsersPage({ users }: IUsersPage) {
  return <Users users={users} />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const users_res = await fetch("http://localhost:3001/api/users", {
    headers: definitions.API_REQUEST_HEADERS,
  });
  const users_json: any = await users_res.json();

  return {
    props: {
      users: users_json.data,
    },
  };
};
