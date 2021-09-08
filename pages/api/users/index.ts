import type { NextApiRequest, NextApiResponse } from "next";
import type { IUser } from "../../../types/users";
import { users } from "../../../fixtures/users";

type ApiResponse = { data: IUser[] };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  res.status(200).json({ data: users });
}
