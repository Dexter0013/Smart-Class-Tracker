import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/auth";
import { getAdminModelFromTable } from "@/lib/admin-table-map";
import { AuthPayload } from "@/lib/types";

type UnauthorizedFormat = "error" | "success";

type AdminApiContextSuccess = {
  ok: true;
  user: AuthPayload;
};

type AdminApiContextFailure = {
  ok: false;
  response: NextResponse;
};

export type AdminApiContext = AdminApiContextSuccess | AdminApiContextFailure;

export type AdminTableModel = Exclude<
  ReturnType<typeof getAdminModelFromTable>,
  null
>;

type AdminTableModelResult =
  | {
      ok: true;
      model: AdminTableModel;
    }
  | {
      ok: false;
      response: NextResponse;
    };

export async function resolveAdminApiContext(
  req: NextRequest,
  unauthorizedFormat: UnauthorizedFormat = "success",
): Promise<AdminApiContext> {
  const user = await authenticateAdmin(req);

  if (!user) {
    return {
      ok: false,
      response:
        unauthorizedFormat === "success"
          ? NextResponse.json(
              { success: false, message: "Unauthorized" },
              { status: 401 },
            )
          : NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return {
    ok: true,
    user,
  };
}

export function adminFailure(message: string, status = 500): NextResponse {
  return NextResponse.json({ success: false, message }, { status });
}

export function resolveAdminTableModel(table: string): AdminTableModelResult {
  const model = getAdminModelFromTable(table);

  if (!model) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, message: "Invalid table name" },
        { status: 400 },
      ),
    };
  }

  return {
    ok: true,
    model,
  };
}
