"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

function generateApiKey(): { key: string; prefix: string } {
  const uuid = crypto.randomUUID().replace(/-/g, "");
  const key = `tn_${uuid}`;
  const prefix = `tn_${uuid.slice(0, 12)}`;
  return { key, prefix };
}

export async function createApiKey(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const membership = await prisma.organizationMember.findFirst({
    where: { userId: user.id },
  });

  if (!membership) redirect("/login");

  const name = (formData.get("name") as string) || "Default Key";

  const { key, prefix } = generateApiKey();

  await prisma.apiKey.create({
    data: {
      key,
      prefix,
      name,
      organizationId: membership.organizationId,
      createdBy: user.id,
    },
  });

  await prisma.auditLog.create({
    data: {
      organizationId: membership.organizationId,
      action: "API_KEY_CREATED",
      resourceType: "ApiKey",
      performedBy: user.id,
      timestamp: new Date(),
    },
  });

  revalidatePath("/dashboard/api-keys");
}

export async function revokeApiKey(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const membership = await prisma.organizationMember.findFirst({
    where: { userId: user.id },
  });

  if (!membership) redirect("/login");

  const keyId = formData.get("keyId") as string;

  const key = await prisma.apiKey.findFirst({
    where: {
      id: keyId,
      organizationId: membership.organizationId,
    },
  });

  if (!key) {
    revalidatePath("/dashboard/api-keys");
    return;
  }

  await prisma.apiKey.update({
    where: { id: keyId },
    data: { isRevoked: true },
  });

  await prisma.auditLog.create({
    data: {
      organizationId: membership.organizationId,
      action: "API_KEY_REVOKED",
      resourceType: "ApiKey",
      resourceId: keyId,
      performedBy: user.id,
      timestamp: new Date(),
    },
  });

  revalidatePath("/dashboard/api-keys");
}
