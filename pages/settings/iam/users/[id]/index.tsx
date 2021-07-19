import { GetServerSideProps } from "next";
import { definitions } from "../../../../../config";
import type { IUser } from "../../../../../types/users";
import type { ILocation } from "../../../../../types/locations";
import type { IRole } from "../../../../../types/roles";
import { UserDetail } from "../../../../../components/Users";

type IUserDetailPage = {
  user: IUser;
  locations: ILocation[];
  roles: IRole[];
};

export default function UserDetailPage({
  user,
  locations,
  roles,
}: IUserDetailPage) {
  return <UserDetail user={user} locations={locations} roles={roles} />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  const headers = { headers: definitions.API_REQUEST_HEADERS };

  const user_res = await fetch(
    `http://localhost:3001/api/users/${id}`,
    headers
  );
  const user_json: any = await user_res.json();

  const roles_res = await fetch("http://localhost:3001/api/roles", headers);
  const roles_json: any = await roles_res.json();

  const locations_res = await fetch(
    "http://localhost:3001/api/locations",
    headers
  );
  const locations_json: any = await locations_res.json();

  return {
    props: {
      user: user_json.data,
      locations: locations_json.data,
      roles: roles_json.data,
    },
  };
};
