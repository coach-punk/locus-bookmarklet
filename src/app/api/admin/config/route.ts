import { NextResponse } from "next/server";
import { z } from "zod";
import { hashAdminToken } from "@/lib/adminToken";
import { readConfig, updateConfig } from "@/lib/config";

const updateSchema = z.object({
  tmdbApiKey: z.string().optional(),
  allowedGithubUsers: z.array(z.string()).optional(),
  adminToken: z.string().min(8).optional(),
});

export async function GET() {
  const config = await readConfig();
  return NextResponse.json({
    tmdbApiKey: config.tmdbApiKey,
    allowedGithubUsers: config.allowedGithubUsers,
    hasAdminToken: Boolean(config.adminTokenHash),
  });
}

export async function PUT(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { adminToken, ...rest } = parsed.data;
  const patch: Parameters<typeof updateConfig>[0] = { ...rest };
  if (adminToken) {
    patch.adminTokenHash = hashAdminToken(adminToken);
  }

  const config = await updateConfig(patch);
  return NextResponse.json({
    tmdbApiKey: config.tmdbApiKey,
    allowedGithubUsers: config.allowedGithubUsers,
    hasAdminToken: Boolean(config.adminTokenHash),
  });
}
