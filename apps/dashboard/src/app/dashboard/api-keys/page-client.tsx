"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Copy,
  Check,
  Loader2,
  Shield,
  ArrowRight,
  Code2,
  Zap,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  saveDomain,
  copyApiKey,
  verifyWebsite,
} from "./actions";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3;
type VerifyStatus = "idle" | "loading" | "success" | "pending";

interface StepConfig {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: StepConfig[] = [
  {
    number: 1,
    title: "Whitelist Your Domain",
    description: "Add your website domain to authorize the widget",
    icon: <Globe className="h-5 w-5" />,
  },
  {
    number: 2,
    title: "Copy Widget Script",
    description: "Get your embeddable script with API key included",
    icon: <Code2 className="h-5 w-5" />,
  },
  {
    number: 3,
    title: "Verify Installation",
    description: "Confirm the widget is receiving data from your site",
    icon: <Zap className="h-5 w-5" />,
  },
];

interface ApiKeysPageProps {
  apiKey: { key: string; prefix: string; name: string } | null;
  websites: { id: string; domain: string; verification: string }[];
}

export default function ApiKeysClient({ apiKey, websites }: ApiKeysPageProps) {
  const [currentStep, setCurrentStep] = useState<Step>(
    websites.length > 0 ? 2 : 1
  );
  const [domain, setDomain] = useState("");
  const [domainSaved, setDomainSaved] = useState(websites.length > 0);
  const [savedDomain, setSavedDomain] = useState(
    websites.length > 0 ? websites[0]?.domain ?? "" : ""
  );
  const [copied, setCopied] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<VerifyStatus>("idle");
  const [saving, setSaving] = useState(false);

  const handleSaveDomain = async () => {
    if (!domain.trim()) return;
    setSaving(true);
    const result = await saveDomain(domain.trim());
    setSaving(false);
    if (result.success) {
      setDomainSaved(true);
      setSavedDomain(domain.trim());
      setCurrentStep(2);
    }
  };

  const handleCopy = useCallback(async () => {
    if (!apiKey) return;
    await copyApiKey(apiKey.key);
    await navigator.clipboard.writeText(
      `<script src="https://cdn.certence.com/widget.js" data-api-key="${apiKey.key}"></script>`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [apiKey]);

  const handleVerify = async () => {
    if (!savedDomain) return;
    setVerifyStatus("loading");
    const result = await verifyWebsite(savedDomain);
    if (result.verified) {
      setVerifyStatus("success");
    } else {
      setVerifyStatus("pending");
    }
  };

  const isStepActive = (step: number) => {
    if (step === 1) return true;
    if (step === 2) return domainSaved;
    if (step === 3) return domainSaved;
    return false;
  };

  const isStepCompleted = (step: number) => {
    if (step === 1) return domainSaved;
    if (step === 2) return copied;
    if (step === 3) return verifyStatus === "success";
    return false;
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Install Transparency Widget
        </h1>
        <p className="mt-1 text-sm text-[#A0A0A0]">
          Follow these 3 simple steps to add AI transparency labels to your
          website.
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-start gap-0">
        {steps.map((step, i) => {
          const active = isStepActive(step.number);
          const completed = isStepCompleted(step.number);
          const isCurrent = step.number === currentStep;
          return (
            <div key={step.number} className="flex flex-1 items-start">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
                    completed
                      ? "border-[#00FFC2] bg-[#00FFC2]/10 text-[#00FFC2]"
                      : isCurrent && active
                        ? "border-[#00FFC2] bg-[#0A0A0A] text-[#00FFC2]"
                        : active
                          ? "border-[#333333] bg-[#0A0A0A] text-[#A0A0A0]"
                          : "border-[#242424] bg-[#121212] text-[#555555]"
                  )}
                >
                  {completed ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    step.icon
                  )}
                </div>
                <div className="mt-3 text-center">
                  <p
                    className={cn(
                      "text-sm font-medium transition-colors",
                      completed || isCurrent
                        ? "text-white"
                        : active
                          ? "text-[#A0A0A0]"
                          : "text-[#555555]"
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="mt-0.5 max-w-[140px] text-xs text-[#666666]">
                    {step.description}
                  </p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="mt-5 flex flex-1 items-center px-2">
                  <div
                    className={cn(
                      "h-0.5 w-full transition-colors duration-300",
                      completed
                        ? "bg-[#00FFC2]"
                        : isStepActive(step.number + 1)
                          ? "bg-[#333333]"
                          : "bg-[#242424]"
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {/* Step 1: Domain */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-xl border border-[#333333] bg-[#1C1C1C] p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00FFC2]/10">
                <Globe className="h-5 w-5 text-[#00FFC2]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Whitelist Your Domain
                </h2>
                <p className="text-sm text-[#A0A0A0]">
                  Enter your website URL to authorize the transparency widget.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#A0A0A0]">
                  Website URL
                </label>
                <div className="flex gap-3">
                  <Input
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="https://example.com"
                    className="h-11 border-[#333333] bg-[#121212] text-white placeholder:text-[#555555] focus-visible:ring-[#00FFC2]/30"
                    onKeyDown={(e) => e.key === "Enter" && handleSaveDomain()}
                  />
                  <Button
                    onClick={handleSaveDomain}
                    disabled={saving || !domain.trim()}
                    className="h-11 gap-2 bg-[#00FFC2] text-[#0A0A0A] hover:bg-[#00FFC2]/90 disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Save Domain
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {websites.length > 0 && (
                <div className="rounded-lg border border-[#333333] bg-[#121212] p-4">
                  <p className="text-xs text-[#666666] mb-2">
                    Already registered domains
                  </p>
                  <div className="space-y-2">
                    {websites.map((w) => (
                      <div
                        key={w.id}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-white font-mono">
                          {w.domain}
                        </span>
                        <Badge
                          variant={
                            w.verification === "VERIFIED" ? "mint" : "outline"
                          }
                        >
                          {w.verification === "VERIFIED"
                            ? "Verified"
                            : "Pending"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Step 2: Script */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              "rounded-xl border p-6 transition-all duration-300",
              domainSaved
                ? "border-[#333333] bg-[#1C1C1C]"
                : "border-[#242424] bg-[#181818] opacity-50 pointer-events-none"
            )}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00FFC2]/10">
                <Code2 className="h-5 w-5 text-[#00FFC2]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Copy Widget Script
                </h2>
                <p className="text-sm text-[#A0A0A0]">
                  Paste this snippet just before the closing{" "}
                  <code className="rounded bg-[#121212] px-1.5 py-0.5 text-xs font-mono text-[#00FFC2]">
                    &lt;/body&gt;
                  </code>{" "}
                  tag on your website.
                </p>
              </div>
            </div>

            {/* Code Block */}
            <div className="relative rounded-lg border border-[#333333] bg-[#0A0A0A] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-[#333333] bg-[#121212]">
                <span className="text-xs text-[#666666] font-mono">
                  embed-snippet.html
                </span>
                {!apiKey ? (
                  <Badge variant="outline" className="text-[10px]">
                    No API key
                  </Badge>
                ) : (
                  <Badge variant="mint" className="text-[10px]">
                    Key ready
                  </Badge>
                )}
              </div>
              <div className="p-4">
                <pre className="text-sm font-mono text-[#E0E0E0] overflow-x-auto">
                  <code>
                    <span className="text-[#A0A0A0]">&lt;</span>
                    <span className="text-[#00FFC2]">script</span>
                    <span className="text-[#A0A0A0]"> src=</span>
                    <span className="text-[#FFB86C]">
                      &quot;https://cdn.certence.com/widget.js&quot;
                    </span>
                    <span className="text-[#A0A0A0]"> data-api-key=</span>
                    <span className="text-[#FFB86C]">
                      &quot;{apiKey ? apiKey.key : "tn_xxx..."}&quot;
                    </span>
                    <span className="text-[#A0A0A0]">&gt;&lt;/</span>
                    <span className="text-[#00FFC2]">script</span>
                    <span className="text-[#A0A0A0]">&gt;</span>
                  </code>
                </pre>
              </div>
              <div className="absolute top-3 right-3">
                <Button
                  onClick={handleCopy}
                  disabled={!apiKey}
                  size="sm"
                  className={cn(
                    "h-8 gap-1.5 text-xs",
                    copied
                      ? "bg-[#00FFC2]/20 text-[#00FFC2] border border-[#00FFC2]/30"
                      : "bg-[#1C1C1C] text-[#A0A0A0] hover:text-white border border-[#333333]"
                  )}
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* API Key Status */}
            {!apiKey && (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-[#FFB86C]/20 bg-[#FFB86C]/5 px-4 py-3">
                <AlertCircle className="h-4 w-4 text-[#FFB86C] shrink-0" />
                <p className="text-sm text-[#FFB86C]">
                  No active API key. Create one in the{" "}
                  <a
                    href="/dashboard/api-keys"
                    className="underline underline-offset-2"
                  >
                    API Keys
                  </a>{" "}
                  section first.
                </p>
              </div>
            )}

            {/* Next Step */}
            {apiKey && (
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={() => setCurrentStep(3)}
                  className="gap-2 bg-[#00FFC2] text-[#0A0A0A] hover:bg-[#00FFC2]/90"
                >
                  Continue to Verification
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </motion.div>
        )}

        {/* Step 3: Verify */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              "rounded-xl border p-6 transition-all duration-300",
              domainSaved
                ? "border-[#333333] bg-[#1C1C1C]"
                : "border-[#242424] bg-[#181818] opacity-50 pointer-events-none"
            )}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00FFC2]/10">
                <Zap className="h-5 w-5 text-[#00FFC2]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Verify Installation
                </h2>
                <p className="text-sm text-[#A0A0A0]">
                  Check if the widget is properly installed and sending data.
                </p>
              </div>
            </div>

            {/* Domain Info */}
            {savedDomain && (
              <div className="mb-6 rounded-lg border border-[#333333] bg-[#121212] px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[#00FFC2]" />
                  <span className="text-sm font-mono text-white">
                    {savedDomain}
                  </span>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  Active
                </Badge>
              </div>
            )}

            {/* Verify Button */}
            <div className="flex justify-center mb-6">
              <Button
                onClick={handleVerify}
                disabled={verifyStatus === "loading"}
                size="lg"
                className={cn(
                  "gap-2 min-w-[200px]",
                  verifyStatus === "success"
                    ? "bg-[#00FFC2]/10 text-[#00FFC2] border border-[#00FFC2]/30 hover:bg-[#00FFC2]/20"
                    : "bg-[#00FFC2] text-[#0A0A0A] hover:bg-[#00FFC2]/90"
                )}
              >
                {verifyStatus === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : verifyStatus === "success" ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Verified
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Test Connection
                  </>
                )}
              </Button>
            </div>

            {/* Status Messages */}
            <AnimatePresence>
              {verifyStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="rounded-lg border border-[#00FFC2]/20 bg-[#00FFC2]/5 px-4 py-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#00FFC2]/20">
                        <CheckCircle2 className="h-4 w-4 text-[#00FFC2]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#00FFC2]">
                          Successfully connected!
                        </p>
                        <p className="mt-1 text-sm text-[#A0A0A0]">
                          We are receiving data from your website. The
                          transparency widget is working correctly.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {verifyStatus === "pending" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="rounded-lg border border-[#FFB86C]/20 bg-[#FFB86C]/5 px-4 py-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FFB86C]/20">
                        <AlertCircle className="h-4 w-4 text-[#FFB86C]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#FFB86C]">
                          Waiting for signal
                        </p>
                        <p className="mt-1 text-sm text-[#A0A0A0]">
                          Please ensure the script is installed and visit your
                          website once to trigger the widget.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
