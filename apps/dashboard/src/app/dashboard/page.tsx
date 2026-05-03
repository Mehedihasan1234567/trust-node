import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { Globe, ScanSearch, Activity } from "lucide-react";

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

  const [websiteCount, scanCount, recentScans] = await Promise.all([
    prisma.website.count({ where: { organizationId: org.id } }),
    prisma.scanResult.count({ where: { website: { organizationId: org.id } } }),
    prisma.scanResult.findMany({
      where: { website: { organizationId: org.id } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your AI transparency widgets
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Websites
            </CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{websiteCount}</div>
            <p className="text-xs text-muted-foreground">
              Registered domains
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            <ScanSearch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scanCount}</div>
            <p className="text-xs text-muted-foreground">
              Content items scanned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Plan</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{org.plan}</div>
            <p className="text-xs text-muted-foreground">
              Current subscription
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Detections</CardTitle>
          <CardDescription>
            Latest AI content found on your websites
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentScans.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No scans yet. Add a website and install the widget to get started.
            </p>
          ) : (
            <div className="space-y-4">
              {recentScans.map((scan: { id: string; pageUrl: string; contentType: string; verdict: string | null; confidence: number | null }) => (
                <div
                  key={scan.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="text-sm font-medium truncate max-w-md">
                      {scan.pageUrl}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {scan.contentType} &middot;{" "}
                      {scan.verdict?.replace("_", " ") || "Pending"}
                    </p>
                  </div>
                  {scan.confidence && (
                    <span className="text-xs text-muted-foreground">
                      {Math.round(scan.confidence * 100)}% confidence
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
