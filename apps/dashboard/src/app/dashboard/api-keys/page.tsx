import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { Key, Plus, Trash2, Copy, Check } from "lucide-react";
import { createApiKey, revokeApiKey } from "./actions";
import { formatDateTime } from "@/lib/utils";

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

  const apiKeys = await prisma.apiKey.findMany({
    where: { organizationId: membership.organizationId, isRevoked: false },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">API Keys</h1>
        <p className="text-muted-foreground">
          Manage API keys for widget authentication
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Create Key */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create API Key
            </CardTitle>
            <CardDescription>
              Generate a new key for the TrustNode widget
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createApiKey} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Key Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Production Key"
                  required
                />
              </div>
              <Button type="submit" className="w-full gap-2">
                <Plus className="h-4 w-4" />
                Generate New Key
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* API Keys List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Your API Keys
            </CardTitle>
            <CardDescription>
              {apiKeys.length === 0
                ? "No API keys yet. Create one to get started."
                : `${apiKeys.length} active key${apiKeys.length > 1 ? "s" : ""}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {apiKeys.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Key className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  Create an API key to use with the TrustNode widget script.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {apiKeys.map((key) => (
                  <div
                    key={key.id}
                    className="rounded-lg border p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{key.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Created {formatDateTime(key.createdAt)}
                        </p>
                      </div>
                      <form action={revokeApiKey}>
                        <input type="hidden" name="keyId" value={key.id} />
                        <Button
                          variant="ghost"
                          size="icon"
                          type="submit"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 rounded bg-muted px-2 py-1.5 text-xs font-mono truncate">
                        {key.prefix}...
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0"
                        title="Copy full key"
                        // Server components can't copy — this is just visual
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
