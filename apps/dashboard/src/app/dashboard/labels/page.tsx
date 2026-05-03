import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";
import { Tags, Filter } from "lucide-react";

export default async function LabelsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const membership = await prisma.organizationMember.findFirst({
    where: { userId: user.id },
  });
  if (!membership) return null;

  const scans = await prisma.scanResult.findMany({
    where: { website: { organizationId: membership.organizationId } },
    include: { website: { select: { domain: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const verdictCounts = {
    total: scans.length,
    aiGenerated: scans.filter((s) => s.verdict === "AI_GENERATED").length,
    aiManipulated: scans.filter((s) => s.verdict === "AI_MANIPULATED").length,
    humanCreated: scans.filter((s) => s.verdict === "HUMAN_CREATED").length,
    uncertain: scans.filter((s) => s.verdict === "UNCERTAIN" || !s.verdict).length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Labels</h1>
        <p className="text-muted-foreground">
          View and manage AI content labels across your websites
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Scans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verdictCounts.total}</div>
          </CardContent>
        </Card>
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400">
              AI Generated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {verdictCounts.aiGenerated}
            </div>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 dark:border-yellow-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
              AI Manipulated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {verdictCounts.aiManipulated}
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-200 dark:border-green-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400">
              Human Created
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {verdictCounts.humanCreated}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Uncertain
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verdictCounts.uncertain}</div>
          </CardContent>
        </Card>
      </div>

      {/* Labels List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Tags className="h-5 w-5" />
                All Detections
              </CardTitle>
              <CardDescription>
                Latest 50 AI content detections
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {scans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Tags className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No labels yet</h3>
              <p className="text-sm text-muted-foreground">
                AI content labels will appear here once your widget starts
                scanning websites.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {scans.map((scan) => (
                <div
                  key={scan.id}
                  className="flex items-center justify-between rounded-lg p-3 hover:bg-muted/50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">
                        {scan.pageUrl}
                      </p>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {scan.website.domain}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {scan.contentType} &middot; {formatDateTime(scan.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    {scan.confidence != null && scan.confidence > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {Math.round(scan.confidence * 100)}%
                      </span>
                    )}
                    <VerdictBadge verdict={scan.verdict} />
                    <ScanStatusBadge status={scan.scanStatus} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function VerdictBadge({ verdict }: { verdict: string | null }) {
  if (!verdict || verdict === "UNCERTAIN") {
    return (
      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
        Uncertain
      </span>
    );
  }
  if (verdict === "AI_GENERATED") {
    return (
      <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900 dark:text-red-300">
        AI Generated
      </span>
    );
  }
  if (verdict === "AI_MANIPULATED") {
    return (
      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
        AI Manipulated
      </span>
    );
  }
  if (verdict === "HUMAN_CREATED") {
    return (
      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
        Human
      </span>
    );
  }
  return null;
}

function ScanStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    COMPLETED: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    PROCESSING: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    FAILED: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-700"}`}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}
