import type { NextApiRequest, NextApiResponse } from "next";
import type { IRole } from "../../types/roles";

import { roles } from "../../fixtures/roles";

type ApiResponse = { data: IRole[] };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  res.status(200).json({ data: roles });
}
