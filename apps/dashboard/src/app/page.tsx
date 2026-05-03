import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Globe, BarChart3 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Shield className="h-6 w-6 text-primary" />
            TrustNode
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="container flex-1 flex flex-col items-center justify-center text-center py-20">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium">
            <span className="animate-pulse-dot mr-2 h-2 w-2 rounded-full bg-green-500" />
            EU AI Act Compliant
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            AI Content Transparency Made Simple
          </h1>
          <p className="text-xl text-muted-foreground">
            Add EU AI Act compliant transparency labels to your website in
            minutes. One script tag, full compliance.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link href="/signup">
              <Button size="lg" className="gap-2">
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t py-20">
        <div className="container">
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="space-y-3 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">One-Line Integration</h3>
              <p className="text-sm text-muted-foreground">
                Add a single script tag to your website. The widget handles
                everything else automatically.
              </p>
            </div>
            <div className="space-y-3 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">EU AI Act Compliant</h3>
              <p className="text-sm text-muted-foreground">
                Built for the EU AI Act transparency requirements. Audit logs
                and compliance reports included.
              </p>
            </div>
            <div className="space-y-3 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Multi-tenant Dashboard</h3>
              <p className="text-sm text-muted-foreground">
                Manage multiple websites, view AI detection reports, and export
                compliance documents.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          TrustNode - EU AI Act Transparency Widget
        </div>
      </footer>
    </div>
  );
}
