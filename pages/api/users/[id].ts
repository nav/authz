import type { NextApiRequest, NextApiResponse } from "next";
import type { IUser } from "../../../types/users";
import { users } from "../../../fixtures/users";

type ApiResponse = { data: IUser };
type ApiErrorResponse = { error: string };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse | ApiErrorResponse>
) {
  const { id } = req.query;
  if (typeof id === "undefined") {
    res.status(404).json({ error: "Not Found" });
    return;
  }

  let userId: number;
  try {
    userId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
  } catch (err) {
    res.status(400).json({ error: "Bad Request" });
    return;
  }

  console.log(userId);
  const results: IUser[] = users.filter((user: IUser) => user.id === userId);

  if (results.length === 0) {
    res.status(404).json({ error: "Not Found" });
    return;
  }

  res.status(200).json({ data: results[0] });
}
