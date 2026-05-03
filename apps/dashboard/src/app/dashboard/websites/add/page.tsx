"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Globe, Info } from "lucide-react";
import Link from "next/link";
import { createWebsite } from "../actions";

export default function AddWebsitePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);

    try {
      const result = await createWebsite(formData);
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      }
      // Successful redirect is handled by the server action
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/websites">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Add Website</h1>
          <p className="text-muted-foreground">
            Register a domain to start detecting AI content
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Domain Details
          </CardTitle>
          <CardDescription>
            Enter the domain where you want to install the TrustNode widget
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="domain">Domain Name *</Label>
              <Input
                id="domain"
                name="domain"
                type="text"
                placeholder="example.com"
                required
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                Enter just the domain name without https:// or www.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name (Optional)</Label>
              <Input
                id="displayName"
                name="displayName"
                type="text"
                placeholder="My Blog"
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                A friendly name to identify this website in your dashboard.
              </p>
            </div>

            <div className="rounded-md bg-blue-50 dark:bg-blue-950 p-4">
              <div className="flex gap-2">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                  <p className="font-medium">What happens next?</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>We&apos;ll generate a DNS verification code</li>
                    <li>
                      Add it as a TXT record in your DNS settings to verify
                      ownership
                    </li>
                    <li>
                      Once verified, you&apos;ll get the embed code to install
                      the widget
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Link href="/dashboard/websites">
                <Button variant="outline" type="button" disabled={loading}>
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add Website"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
