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

export async function saveDomain(domain: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  const membership = await prisma.organizationMember.findFirst({
    where: { userId: user.id },
  });

  if (!membership) return { success: false, error: "No organization" };

  const normalizedDomain = domain
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "")
    .toLowerCase();

  try {
    await prisma.website.upsert({
      where: { domain: normalizedDomain },
      update: {
        organizationId: membership.organizationId,
        verification: "PENDING",
      },
      create: {
        domain: normalizedDomain,
        organizationId: membership.organizationId,
        verification: "PENDING",
        verificationCode: crypto.randomUUID().slice(0, 8),
      },
    });

    await prisma.auditLog.create({
      data: {
        organizationId: membership.organizationId,
        action: "DOMAIN_WHITELISTED",
        resourceType: "Website",
        resourceId: normalizedDomain,
        performedBy: user.id,
        timestamp: new Date(),
      },
    });

    revalidatePath("/dashboard/api-keys");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to save domain" };
  }
}

export async function copyApiKey(key: string) {
  "use server";
  return { success: true };
}

export async function verifyWebsite(domain: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { verified: false };

  const membership = await prisma.organizationMember.findFirst({
    where: { userId: user.id },
  });

  if (!membership) return { verified: false };

  const website = await prisma.website.findFirst({
    where: {
      domain,
      organizationId: membership.organizationId,
    },
  });

  if (!website) return { verified: false };

  const verified = website.verification === "VERIFIED";

  revalidatePath("/dashboard/api-keys");
  return { verified };
}
