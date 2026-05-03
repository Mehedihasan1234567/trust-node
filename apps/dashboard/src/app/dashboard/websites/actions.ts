"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { generateVerificationCode } from "@/lib/utils";
import { DomainSchema, UpdateWidgetConfigSchema } from "@trust-node/shared";

export async function createWebsite(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const membership = await prisma.organizationMember.findFirst({
    where: { userId: user.id },
  });

  if (!membership) {
    redirect("/login");
  }

  const rawDomain = formData.get("domain") as string;
  const displayName = (formData.get("displayName") as string) || undefined;

  const parsed = DomainSchema.safeParse(rawDomain);

  if (!parsed.success) {
    return {
      error: "Invalid domain format. Example: example.com",
    };
  }

  const domain = parsed.data;

  const existing = await prisma.website.findUnique({
    where: { domain },
  });

  if (existing) {
    return {
      error:
        existing.organizationId === membership.organizationId
          ? "This domain is already registered to your organization."
          : "This domain is already registered by another organization.",
    };
  }

  const verificationCode = generateVerificationCode();

  await prisma.website.create({
    data: {
      domain,
      displayName,
      organizationId: membership.organizationId,
      verificationCode,
      verification: "PENDING",
      widgetConfig: {
        create: {
          theme: "AUTO",
          position: "INLINE_ONLY",
          autoScan: true,
          scanText: true,
          scanImages: true,
          disclosurePrefix: "AI Disclosure:",
          language: "en",
        },
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      organizationId: membership.organizationId,
      action: "WEBSITE_ADDED",
      resourceType: "Website",
      performedBy: user.id,
      timestamp: new Date(),
    },
  });

  revalidatePath("/dashboard/websites");
  redirect("/dashboard/websites");
}

export async function updateWidgetConfig(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const membership = await prisma.organizationMember.findFirst({
    where: { userId: user.id },
  });

  if (!membership) redirect("/login");

  const websiteId = formData.get("websiteId") as string;

  const website = await prisma.website.findFirst({
    where: { id: websiteId, organizationId: membership.organizationId },
  });

  if (!website) redirect("/dashboard/websites");

  const rawData = {
    theme: formData.get("theme") as string | null,
    position: formData.get("position") as string | null,
    autoScan: formData.get("autoScan") === "on",
    scanText: formData.get("scanText") === "on",
    scanImages: formData.get("scanImages") === "on",
    disclosurePrefix: (formData.get("disclosurePrefix") as string) || null,
    language: (formData.get("language") as string) || null,
  };

  const parsed = UpdateWidgetConfigSchema.safeParse(rawData);
  if (!parsed.success) {
    revalidatePath(`/dashboard/websites/${websiteId}`);
    return;
  }

  await prisma.widgetConfig.update({
    where: { websiteId },
    data: parsed.data,
  });

  await prisma.auditLog.create({
    data: {
      organizationId: membership.organizationId,
      action: "WIDGET_CONFIG_UPDATED",
      resourceType: "WidgetConfig",
      resourceId: websiteId,
      performedBy: user.id,
      timestamp: new Date(),
    },
  });

  revalidatePath(`/dashboard/websites/${websiteId}`);
}

export async function deleteWebsite(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const membership = await prisma.organizationMember.findFirst({
    where: { userId: user.id },
  });

  if (!membership) redirect("/login");

  const websiteId = formData.get("websiteId") as string;

  const website = await prisma.website.findFirst({
    where: { id: websiteId, organizationId: membership.organizationId },
  });

  if (!website) redirect("/dashboard/websites");

  await prisma.website.delete({
    where: { id: websiteId },
  });

  await prisma.auditLog.create({
    data: {
      organizationId: membership.organizationId,
      action: "WEBSITE_DELETED",
      resourceType: "Website",
      resourceId: websiteId,
      performedBy: user.id,
      metadata: { domain: website.domain },
      timestamp: new Date(),
    },
  });

  revalidatePath("/dashboard/websites");
  redirect("/dashboard/websites");
}
