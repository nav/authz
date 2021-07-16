import type { NextApiRequest, NextApiResponse } from "next";
import type { IPermissions } from "../../types/permissions";
import { permissions } from "../../fixtures/permissions";

type ApiResponse = { data: IPermissions };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  res.status(200).json({ data: permissions });
}
