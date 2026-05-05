"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Lock,
  Sparkles,
  Scan,
  BadgeCheck,
  CheckCircle2,
  Code,
} from "lucide-react";

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

const HOW_STEPS = [
  {
    id: 1,
    title: "Add the Script",
    description:
      "Copy one line of code into your <head> tag. Works with any platform — React, WordPress, or plain HTML.",
    icon: Code,
  },
  {
    id: 2,
    title: "AI Scans Content",
    description:
      "Our engine automatically detects AI-generated content across your pages in real-time using C2PA metadata.",
    icon: Scan,
  },
  {
    id: 3,
    title: "Stay Compliant",
    description:
      "Transparency labels appear automatically. Audit logs and reports keep you regulation-ready 24/7.",
    icon: BadgeCheck,
  },
];

const PLANS = [
  {
    name: "Starter",
    price: "$29",
    description: "For small sites",
    features: ["1 Website", "1,000 Scans/mo", "Basic Reports"],
  },
  {
    name: "Pro",
    price: "$99",
    description: "For growing teams",
    features: [
      "10 Websites",
      "50,000 Scans/mo",
      "Priority Support",
      "API Access",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large orgs",
    features: [
      "Unlimited Sites",
      "Custom Scans",
      "Dedicated Success Manager",
      "SLA",
    ],
  },
];

/* ═══════════════════════════════════════════
   NAVBAR
   ═══════════════════════════════════════════ */

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-charcoal-900/60 border-b border-white/5">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-clash font-bold text-2xl text-white"
        >
          <div className="w-8 h-8 rounded-lg bg-electric-green flex items-center justify-center text-charcoal-900">
            <Shield className="w-5 h-5" />
          </div>
          Certence
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#E0E0E0]">
          <a
            href="#features"
            className="hover:text-electric-green transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="hover:text-electric-green transition-colors"
          >
            How it Works
          </a>
          <a
            href="#pricing"
            className="hover:text-electric-green transition-colors"
          >
            Pricing
          </a>
        </div>
        <Link href="/login">
          <button className="px-6 py-2.5 rounded-full border border-white/10 hover:border-electric-green/50 hover:text-electric-green transition-all text-sm font-semibold text-white">
            Get Started
          </button>
        </Link>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════ */

function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6 overflow-hidden">
      {/* Ambient glassmorphism blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-electric-green/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyber-rose/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-electric-green/20 bg-electric-green/5 px-4 py-1.5 text-sm font-medium text-electric-green mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-electric-green opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-electric-green" />
          </span>
          EU AI Act Compliance Widget
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-clash text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-8"
        >
          AI Transparency <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-green to-carbon-mint">
            Made Simple
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-xl text-[#E0E0E0] max-w-2xl mx-auto leading-relaxed mb-10 font-general"
        >
          Add EU AI Act compliant transparency labels to your website in
          minutes. One script tag. Full compliance. Zero headaches.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <Link href="/signup">
            <button className="group relative px-8 py-4 bg-electric-green text-charcoal-900 font-bold rounded-full text-base shadow-[0_0_20px_rgba(0,255,171,0.3)] hover:shadow-[0_0_40px_rgba(0,255,171,0.6)] transition-all duration-300 flex items-center gap-2">
              Start Free Trial
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <Link href="/login">
            <button className="px-8 py-4 rounded-full border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all text-base font-semibold text-white">
              View Demo
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Floating browser mockup */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="relative z-10 w-full max-w-4xl mx-auto"
      >
        <div className="relative rounded-2xl border border-white/10 bg-charcoal-800/80 backdrop-blur-xl p-2 shadow-2xl animate-float">
          <div className="rounded-xl overflow-hidden bg-charcoal-900 border border-white/5">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-charcoal-800">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
              </div>
              <div className="flex-1 text-center">
                <div className="inline-flex items-center gap-2 text-xs text-white/30 bg-white/5 px-3 py-1 rounded-md">
                  <Lock className="w-3 h-3" /> certence.io
                </div>
              </div>
            </div>

            {/* Dashboard content */}
            <div className="p-8 grid gap-6">
              <div className="flex items-center justify-between">
                <div className="h-4 w-32 bg-white/10 rounded" />
                <div className="h-8 w-24 bg-electric-green/20 rounded-lg border border-electric-green/30 flex items-center justify-center text-xs text-electric-green font-medium">
                  Active
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-charcoal-800 border border-white/5"
                  >
                    <div className="h-3 w-12 bg-white/10 rounded mb-3" />
                    <div className="h-6 w-8 bg-white/20 rounded" />
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-r from-electric-green/10 to-transparent border border-electric-green/20 flex items-center gap-4">
                <Sparkles className="w-5 h-5 text-electric-green" />
                <div className="text-sm text-[#E0E0E0]">
                  <span className="text-electric-green font-semibold">
                    AI Generated:
                  </span>{" "}
                  This summary was produced by an AI model.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating status badge */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-4 -top-4 bg-charcoal-800 border border-electric-green/30 rounded-xl p-3 shadow-lg"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-electric-green animate-pulse" />
            <span className="text-xs font-semibold text-electric-green">
              Compliant
            </span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   PROBLEM / AGITATION
   ═══════════════════════════════════════════ */

function ProblemSection() {
  const text =
    "The EU AI Act imposes fines up to €35 Million or 7% of global turnover for non-compliance.";
  const words = text.split(" ");

  return (
    <section className="relative py-24 px-6 bg-charcoal-900 overflow-hidden border-y border-white/5">
      <div className="max-w-5xl mx-auto text-center">
        <p className="font-clash text-3xl sm:text-5xl lg:text-6xl font-medium leading-tight flex flex-wrap justify-center">
          {words.map((word, i) => {
            const isHighlight =
              word.includes("€") ||
              word.includes("%") ||
              word === "Million" ||
              word === "non-compliance.";
            return (
              <motion.span
                key={i}
                initial={{ opacity: 0.15, color: "#444" }}
                whileInView={{
                  opacity: 1,
                  color: isHighlight ? "#EF5777" : "#FFFFFF",
                }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                className="inline-block mr-[0.25em]"
              >
                {word}
              </motion.span>
            );
          })}
        </p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 text-xl text-[#E0E0E0] max-w-2xl mx-auto font-general"
        >
          If your platform uses AI-generated content without proper transparency
          disclosures, you are exposed. Certence automates the entire compliance
          pipeline.
        </motion.p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   HOW IT WORKS — Clickable tabs
   ═══════════════════════════════════════════ */

function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="relative py-20 sm:py-24 bg-charcoal-900">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="font-clash text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">
            How it <span className="text-electric-green">Works</span>
          </h2>
          <p className="text-[#E0E0E0]/70 text-base sm:text-lg max-w-xl mx-auto">
            Three steps to full compliance. Click any step to preview.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* Left: Clickable step cards */}
          <div className="space-y-4">
            {HOW_STEPS.map((s, i) => {
              const isActive = activeStep === i;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveStep(i)}
                  className={`w-full text-left rounded-2xl border transition-all duration-300 p-5 sm:p-6 group ${
                    isActive
                      ? "border-electric-green/40 bg-electric-green/5 shadow-[0_0_30px_rgba(0,255,171,0.06)]"
                      : "border-white/10 bg-charcoal-800/40 hover:border-white/20 hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-clash font-bold text-lg sm:text-xl transition-colors duration-300 ${
                        isActive
                          ? "bg-electric-green text-charcoal-900"
                          : "bg-white/5 text-white/30 group-hover:text-white/60"
                      }`}
                    >
                      0{i + 1}
                    </div>
                    <div className="min-w-0">
                      <h3
                        className={`text-lg sm:text-xl font-bold mb-1 transition-colors duration-300 ${
                          isActive ? "text-electric-green" : "text-white"
                        }`}
                      >
                        {s.title}
                      </h3>
                      <p className="text-sm sm:text-base text-[#E0E0E0]/70 leading-relaxed">
                        {s.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Visual preview */}
          <div className="relative h-[320px] sm:h-[380px] lg:h-[420px] flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-electric-green/5 to-cyber-rose/5 rounded-3xl blur-3xl" />
            <div className="relative w-full max-w-sm lg:max-w-md h-full bg-charcoal-800 rounded-3xl border border-white/10 p-6 lg:p-8 flex items-center justify-center overflow-hidden shadow-2xl">
              <VisualState activeStep={activeStep} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function VisualState({ activeStep }: { activeStep: number }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <AnimatePresence mode="wait">
        {activeStep === 0 && (
          <motion.div
            key="script"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-sm"
          >
            <div className="bg-charcoal-900 rounded-xl border border-white/10 p-5 sm:p-6 font-mono text-xs sm:text-sm">
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
              </div>
              <div className="text-white/20 mb-2">
                {"<!-- One line integration -->"}
              </div>
              <div className="text-cyber-rose">{"<script"}</div>
              <div className="pl-4 text-electric-green">src=</div>
              <div className="pl-8 text-white">
                &quot;https://certence.io/widget.js&quot;
              </div>
              <div className="text-cyber-rose">{"></script>"}</div>
            </div>
          </motion.div>
        )}

        {activeStep === 1 && (
          <motion.div
            key="scan"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-sm space-y-4"
          >
            <div className="flex items-center justify-between text-sm text-[#E0E0E0] mb-2">
              <span>Scanning pages...</span>
              <span className="text-electric-green">67%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-electric-green"
                initial={{ width: 0 }}
                animate={{ width: "67%" }}
                transition={{ duration: 1 }}
              />
            </div>
            <div className="space-y-2">
              {["Homepage", "Blog Post #42", "Product Description"].map(
                (item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5"
                  >
                    <span className="text-xs text-[#E0E0E0]">{item}</span>
                    <div className="flex items-center gap-2">
                      {i < 2 ? (
                        <>
                          <div className="w-2 h-2 rounded-full bg-electric-green animate-pulse" />
                          <span className="text-[10px] text-electric-green">
                            Detected
                          </span>
                        </>
                      ) : (
                        <span className="text-[10px] text-white/30">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </motion.div>
        )}

        {activeStep === 2 && (
          <motion.div
            key="badge"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-electric-green/10 flex items-center justify-center border border-electric-green/30 mb-5 sm:mb-6 shadow-[0_0_40px_rgba(0,255,171,0.15)]">
              <BadgeCheck className="w-10 h-10 sm:w-12 sm:h-12 text-electric-green" />
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-white mb-2">
              Compliance Active
            </h4>
            <p className="text-sm text-[#E0E0E0] mb-5 sm:mb-6">
              Your site is now EU AI Act ready.
            </p>
            <div className="w-full max-w-xs space-y-3">
              {["Transparency Labels", "Audit Logs", "Legal Reports"].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-electric-green shrink-0" />
                    <span className="text-sm text-[#E0E0E0]">{item}</span>
                  </div>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PRICING
   ═══════════════════════════════════════════ */

function PricingSection() {
  return (
    <section id="pricing" className="pt-16 pb-24 px-6 bg-charcoal-900">
      <div className="container mx-auto">
        <div className="text-center mb-20">
          <h2 className="font-clash text-4xl sm:text-5xl font-bold mb-4">
            Simple <span className="text-electric-green">Pricing</span>
          </h2>
          <p className="text-[#E0E0E0] text-lg">
            Compliance as a service. No hidden fees.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-8 border transition-all duration-300 group ${
                plan.popular
                  ? "border-electric-green/50 bg-charcoal-800"
                  : "border-white/10 bg-charcoal-900 hover:border-electric-green/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-electric-green text-charcoal-900 text-xs font-bold px-3 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-xl font-bold text-white mb-2">
                {plan.name}
              </h3>
              <div className="text-4xl font-clash font-bold text-white mb-2">
                {plan.price}
              </div>
              <p className="text-sm text-white/40 mb-8">
                {plan.description}
              </p>
              <ul className="space-y-4 mb-8">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-3 text-sm text-[#E0E0E0]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-electric-green shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  plan.popular
                    ? "bg-electric-green text-charcoal-900 hover:shadow-[0_0_20px_rgba(0,255,171,0.4)]"
                    : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════ */

function Footer() {
  return (
    <footer className="border-t border-white/5 bg-charcoal-900 py-16 px-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-clash font-bold text-xl text-white"
        >
          <div className="w-6 h-6 rounded bg-electric-green flex items-center justify-center text-charcoal-900">
            <Shield className="w-4 h-4" />
          </div>
          Certence
        </Link>
        <p className="text-sm text-white/30">
          © {new Date().getFullYear()} Certence. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm text-white/30">
          <span className="hover:text-electric-green cursor-pointer transition-colors">
            Privacy
          </span>
          <span className="hover:text-electric-green cursor-pointer transition-colors">
            Terms
          </span>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   PAGE EXPORT
   ═══════════════════════════════════════════ */

export default function LandingPage() {
  return (
    <div className="relative bg-charcoal-900 text-white font-general selection:bg-electric-green selection:text-charcoal-900 overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <HowItWorksSection />
      <PricingSection />
      <Footer />
    </div>
  );
}
