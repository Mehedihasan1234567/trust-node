import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import ApiKeysClient from "./page-client";

export default async function ApiKeysPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const membership = await prisma.organizationMember.findFirst({
    where: { userId: user.id },
  });

  if (!membership) return null;

  const apiKey = await prisma.apiKey.findFirst({
    where: {
      organizationId: membership.organizationId,
      isRevoked: false,
    },
    orderBy: { createdAt: "desc" },
  });

  const websites = await prisma.website.findMany({
    where: { organizationId: membership.organizationId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <ApiKeysClient
      apiKey={
        apiKey
          ? { key: apiKey.key, prefix: apiKey.prefix, name: apiKey.name }
          : null
      }
      websites={websites.map((w) => ({
        id: w.id,
        domain: w.domain,
        verification: w.verification,
      }))}
    />
  );
}
