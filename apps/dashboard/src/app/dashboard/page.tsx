import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { MetricsSection } from "@/components/dashboard/metrics-section";
import { AuditTrailTable } from "@/components/dashboard/audit-trail-table";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const membership = await prisma.organizationMember.findFirst({
    where: { userId: user.id },
    include: { organization: true },
  });
  if (!membership) return null;

  const org = membership.organization;

  const [
    websiteCount,
    scanCount,
    recentScans,
    totalCompletedScans,
    flaggedScans,
  ] = await Promise.all([
    prisma.website.count({ where: { organizationId: org.id } }),
    prisma.scanResult.count({
      where: { website: { organizationId: org.id } },
    }),
    prisma.scanResult.findMany({
      where: { website: { organizationId: org.id } },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { website: { select: { domain: true } } },
    }),
    prisma.scanResult.count({
      where: {
        website: { organizationId: org.id },
        scanStatus: "COMPLETED",
      },
    }),
    prisma.scanResult.count({
      where: {
        website: { organizationId: org.id },
        scanStatus: "COMPLETED",
        verdict: { in: ["AI_GENERATED", "AI_MANIPULATED"] },
        disclosureMsg: null,
      },
    }),
  ]);

  const complianceScore =
    totalCompletedScans > 0
      ? Math.round(
          ((totalCompletedScans - flaggedScans) / totalCompletedScans) * 100
        )
      : 100;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Overview
        </h1>
        <p className="mt-1 text-sm text-[#A0A0A0]">
          Monitor your AI compliance posture across all domains.
        </p>
      </div>

      <MetricsSection
        complianceScore={complianceScore}
        websiteCount={websiteCount}
        scanCount={scanCount}
      />

      <AuditTrailTable scans={recentScans} />
    </div>
  );
}
