import type { NextApiRequest, NextApiResponse } from "next";
import type { ISegment } from "../../types/segments";

import { segments } from "../../fixtures/users";

type ApiResponse = { data: ISegment[] };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  res.status(200).json({ data: segments });
}
