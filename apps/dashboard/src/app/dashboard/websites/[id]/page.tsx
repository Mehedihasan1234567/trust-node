import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Globe,
  Copy,
  Settings,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { updateWidgetConfig, deleteWebsite } from "../actions";
import { formatDateTime, generateVerificationCode } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function WebsiteDetailPage({ params }: PageProps) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const membership = await prisma.organizationMember.findFirst({
    where: { userId: user.id },
  });
  if (!membership) notFound();

  const website = await prisma.website.findFirst({
    where: {
      id,
      organizationId: membership.organizationId,
    },
    include: {
      widgetConfig: true,
      scanResults: {
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });

  if (!website) notFound();

  const widgetConfig = website.widgetConfig;

  return (
    <div className="max-w-3xl space-y-6">
      {/* Back + Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/websites">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">
              {website.displayName || website.domain}
            </h1>
            <p className="text-muted-foreground">{website.domain}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              website.isActive
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {website.isActive ? "Active" : "Inactive"}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              website.verification === "VERIFIED"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                : website.verification === "PENDING"
                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                  : "bg-red-100 text-red-700"
            }`}
          >
            {website.verification}
          </span>
        </div>
      </div>

      {/* Embed Code */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Embed Code
          </CardTitle>
          <CardDescription>
            Add this script to your website&apos;s HTML to activate the TrustNode
            widget
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded bg-muted px-3 py-2 text-sm break-all">
              {`<script src="${process.env.NEXT_PUBLIC_WIDGET_CDN_URL || "https://cdn.trust-node.ai"}/widget/v1.js" data-api-key="YOUR_API_KEY" data-position="${website.widgetConfig?.position.toLowerCase() || "inline_only"}" async></script>`}
            </code>
            <Button variant="outline" size="icon" title="Copy code">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          {website.verification !== "VERIFIED" && (
            <div className="mt-4 rounded-md bg-yellow-50 dark:bg-yellow-950 p-3 text-sm text-yellow-800 dark:text-yellow-200">
              <AlertTriangle className="inline h-4 w-4 mr-1" />
              Verify your domain first. Add this TXT record to your DNS:
              <code className="ml-2 rounded bg-yellow-100 dark:bg-yellow-900 px-2 py-0.5 font-mono text-xs">
                {website.verificationCode}
              </code>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Widget Configuration */}
      {widgetConfig && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Widget Configuration
            </CardTitle>
            <CardDescription>
              Customize how the widget appears on your website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateWidgetConfig} className="space-y-6">
              <input type="hidden" name="websiteId" value={website.id} />

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Theme */}
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select name="theme" defaultValue={widgetConfig.theme}>
                    <SelectTrigger id="theme">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LIGHT">Light</SelectItem>
                      <SelectItem value="DARK">Dark</SelectItem>
                      <SelectItem value="AUTO">Auto (System)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Position */}
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Select
                    name="position"
                    defaultValue={widgetConfig.position}
                  >
                    <SelectTrigger id="position">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INLINE_ONLY">
                        Inline Labels Only
                      </SelectItem>
                      <SelectItem value="TOP_BANNER">
                        Top Banner
                      </SelectItem>
                      <SelectItem value="BOTTOM_BAR">
                        Bottom Bar
                      </SelectItem>
                      <SelectItem value="MODAL_ONLY">
                        Modal Only
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Scan</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically scan content when the page loads
                    </p>
                  </div>
                  <Switch
                    name="autoScan"
                    defaultChecked={widgetConfig.autoScan}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Scan Text</Label>
                    <p className="text-xs text-muted-foreground">
                      Detect AI-generated text content
                    </p>
                  </div>
                  <Switch
                    name="scanText"
                    defaultChecked={widgetConfig.scanText}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Scan Images</Label>
                    <p className="text-xs text-muted-foreground">
                      Detect AI-generated images
                    </p>
                  </div>
                  <Switch
                    name="scanImages"
                    defaultChecked={widgetConfig.scanImages}
                  />
                </div>
              </div>

              {/* Disclosure Prefix */}
              <div className="space-y-2">
                <Label htmlFor="disclosurePrefix">
                  Disclosure Text Prefix
                </Label>
                <Input
                  id="disclosurePrefix"
                  name="disclosurePrefix"
                  defaultValue={widgetConfig.disclosurePrefix || "AI Disclosure:"}
                  placeholder="AI Disclosure:"
                />
              </div>

              <Button type="submit">Save Configuration</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Recent Scans for this website */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Scans</CardTitle>
          <CardDescription>
            Latest AI content detections on this website
          </CardDescription>
        </CardHeader>
        <CardContent>
          {website.scanResults.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No scans yet. Install the widget on your website to start
              detecting AI content.
            </p>
          ) : (
            <div className="space-y-3">
              {website.scanResults.map((scan) => (
                <div
                  key={scan.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {scan.pageUrl}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {scan.contentType} &middot;{" "}
                      {scan.verdict?.replace(/_/g, " ") || "Pending"}
                      &middot;{" "}
                      {scan.scannedAt
                        ? formatDateTime(scan.scannedAt)
                        : "Waiting"}
                    </p>
                  </div>
                  {scan.verdict &&
                    scan.verdict !== "UNCERTAIN" &&
                    scan.verdict !== "HUMAN_CREATED" && (
                      <span className="ml-2 shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900 dark:text-red-300">
                        AI Content
                      </span>
                    )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Permanently delete this website and all associated data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={deleteWebsite}>
            <input type="hidden" name="websiteId" value={website.id} />
            <Button variant="destructive" type="submit">
              Delete Website
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
