import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { Globe, Plus, Copy, ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function WebsitesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const membership = await prisma.organizationMember.findFirst({
    where: { userId: user.id },
  });
  if (!membership) return null;

  const websites = await prisma.website.findMany({
    where: { organizationId: membership.organizationId },
    include: { widgetConfig: true, scanResults: { take: 1, orderBy: { createdAt: "desc" } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Websites</h1>
          <p className="text-muted-foreground">
            Manage websites where the widget is installed
          </p>
        </div>
        <Link href="/dashboard/websites/add">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Website
          </Button>
        </Link>
      </div>

      {websites.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Globe className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No websites yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add your first website to start detecting AI content
            </p>
            <Link href="/dashboard/websites/add">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Website
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {websites.map((site: { id: string; domain: string; displayName: string | null; isActive: boolean; verification: string; widgetConfig: unknown; scanResults: unknown[] }) => (
            <Link key={site.id} href={`/dashboard/websites/${site.id}`}>
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-base">
                        {site.displayName || site.domain}
                      </CardTitle>
                      <CardDescription>{site.domain}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        site.isActive
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {site.isActive ? "Active" : "Inactive"}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        site.verification === "VERIFIED"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {site.verification}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex items-center gap-2">
                <code className="flex-1 rounded bg-muted px-3 py-2 text-sm break-all">
                  {`<script src="${process.env.NEXT_PUBLIC_WIDGET_CDN_URL || "https://cdn.trust-node.ai"}/widget/v1.js" data-api-key="YOUR_API_KEY" async></script>`}
                </code>
                <Button variant="outline" size="icon" title="Copy script">
                  <Copy className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
