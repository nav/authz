import type { NextApiRequest, NextApiResponse } from "next";
import type { ILocation } from "../../types/users";

import { locations } from "../../fixtures/users";

type ApiResponse = { data: ILocation[] };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  res.status(200).json({ data: locations });
}
