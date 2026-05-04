import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import {
  ArrowRight,
  Shield,
  Globe,
  BarChart3,
  Zap,
  Lock,
  FileText,
  Code,
  CheckCircle2,
  Star,
  Users,
  TrendingUp,
  Award,
  Sparkles,
} from "lucide-react";

const TRUST_LOGOS = [
  { name: "TechCrunch", abbr: "TC" },
  { name: "Forbes", abbr: "F" },
  { name: "Wired", abbr: "W" },
  { name: "The Verge", abbr: "V" },
  { name: "Bloomberg", abbr: "B" },
];

const FEATURES = [
  {
    icon: Code,
    title: "One-Line Integration",
    description:
      "Add a single script tag to your website. The widget handles everything else automatically — no dev team required.",
    color: "#00D4FF",
  },
  {
    icon: Shield,
    title: "EU AI Act Compliant",
    description:
      "Built for the EU AI Act transparency requirements. Audit logs and compliance reports included out of the box.",
    color: "#0B3D91",
  },
  {
    icon: BarChart3,
    title: "Multi-tenant Dashboard",
    description:
      "Manage multiple websites, view AI detection reports, and export compliance documents from one place.",
    color: "#00D4FF",
  },
  {
    icon: Zap,
    title: "Real-time Detection",
    description:
      "Our AI engine scans your content in real-time and labels AI-generated text, images, and media instantly.",
    color: "#0B3D91",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description:
      "SOC 2 Type II certified, GDPR compliant, and end-to-end encrypted. Your data never leaves your control.",
    color: "#00D4FF",
  },
  {
    icon: FileText,
    title: "Auto-generated Reports",
    description:
      "One-click compliance reports for auditors and regulators. Stay audit-ready every day of the year.",
    color: "#0B3D91",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Add the Script",
    description:
      "Copy one line of code and paste it into your website's <head> tag. Works with any platform.",
  },
  {
    number: "02",
    title: "AI Scans Content",
    description:
      "Our engine automatically detects AI-generated content across your pages in real-time.",
  },
  {
    number: "03",
    title: "Stay Compliant",
    description:
      "Transparency labels appear automatically. Audit logs and reports keep you regulation-ready.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "TrustNode saved us weeks of legal review. We were EU AI Act compliant in under 10 minutes.",
    author: "Sarah Chen",
    role: "CTO, ContentForge",
    rating: 5,
  },
  {
    quote:
      "The real-time detection is incredible. We didn't even know how much AI content we had until TrustNode showed us.",
    author: "Marcus Johnson",
    role: "Head of Product, MediaScale",
    rating: 5,
  },
  {
    quote:
      "Finally, a compliance tool that doesn't require a team of engineers. This is a no-brainer.",
    author: "Elena Rodriguez",
    role: "Legal Counsel, TechVentures",
    rating: 5,
  },
];

const STATS = [
  { value: "10,000+", label: "Websites Protected", icon: Globe },
  { value: "99.9%", label: "Uptime SLA", icon: TrendingUp },
  { value: "50M+", label: "Pages Scanned", icon: BarChart3 },
  { value: "4.9/5", label: "Customer Rating", icon: Star },
];

/* ─── Clean ambient background tint ─── */
function AmbientBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Very subtle warm blue wash — derived from Cosmic Blue #0B3D91 */}
      <div
        className="absolute inset-0 opacity-100"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(11,61,145,0.04) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0,212,255,0.03) 0%, transparent 50%)",
        }}
      />
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="group relative p-8 rounded-2xl bg-white border border-[#E8ECF1] hover:border-[#00D4FF]/30 hover:shadow-[0_8px_40px_-12px_rgba(0,212,255,0.15)] transition-all duration-300">
      <div
        className="mb-5 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-opacity-10"
        style={{ backgroundColor: `${color}18` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <h3 className="text-lg font-semibold text-[#0B3D91] mb-2">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-500">{description}</p>
    </div>
  );
}

/* ─── Large browser mockup — clean, no clutter ─── */
function BrowserMockup() {
  return (
    <div className="relative w-full max-w-[1100px] mx-auto">
      {/* Soft glow behind */}
      <div
        className="absolute -top-6 left-1/2 -translate-x-1/2 w-[90%] h-48 opacity-40 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 0%, rgba(0,212,255,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative bg-white rounded-t-2xl shadow-[0_-4px_60px_-15px_rgba(11,61,145,0.08)] border border-slate-200/60 overflow-hidden">
        {/* Browser chrome */}
        <div className="flex items-center gap-3 px-5 py-3.5 bg-[#FAFBFC] border-b border-slate-100">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#E8ECF1]" />
            <div className="w-3 h-3 rounded-full bg-[#E8ECF1]" />
            <div className="w-3 h-3 rounded-full bg-[#E8ECF1]" />
          </div>
          <div className="flex-1 mx-4 max-w-md">
            <div className="bg-white rounded-md px-3 py-1 text-[11px] text-slate-400 text-center border border-slate-100 flex items-center justify-center gap-1.5">
              <Lock className="w-3 h-3" />
              trustnode.io/dashboard
            </div>
          </div>
        </div>

        {/* Dashboard UI */}
        <div className="p-6 sm:p-10 bg-white">
          <div className="flex items-start gap-8">
            {/* Sidebar */}
            <div className="hidden md:flex flex-col gap-3 w-44 shrink-0">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#0B3D91] to-[#00D4FF] flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm font-bold text-[#0B3D91]">TrustNode</span>
              </div>
              {[80, 60, 75, 55, 65].map((w, i) => (
                <div
                  key={i}
                  className="h-2 rounded bg-slate-100"
                  style={{ width: `${w}%` }}
                />
              ))}
            </div>

            {/* Main */}
            <div className="flex-1 space-y-6 min-w-0">
              {/* Page header */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-3.5 w-36 bg-slate-200 rounded mb-2" />
                  <div className="h-2 w-24 bg-slate-100 rounded" />
                </div>
                <div className="h-8 px-4 rounded-lg bg-[#00D4FF]/10 border border-[#00D4FF]/20 flex items-center">
                  <span className="text-[11px] font-semibold text-[#0B3D91]">Active</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Websites", val: "12" },
                  { label: "Scans Today", val: "1.2K" },
                  { label: "Compliance", val: "100%" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl border border-slate-100 p-4 bg-[#FAFBFC]"
                  >
                    <div className="text-[11px] text-slate-400 mb-1.5">{s.label}</div>
                    <div className="text-xl font-bold text-[#0B3D91]">{s.val}</div>
                  </div>
                ))}
              </div>

              {/* Transparency banner */}
              <div className="bg-gradient-to-r from-[#0B3D91] to-[#0d4db5] rounded-xl p-5 text-white relative overflow-hidden">
                <div className="relative z-10 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold uppercase tracking-wider opacity-80">
                      AI Transparency Label
                    </div>
                    <div className="text-sm opacity-90">
                      This content was generated with AI assistance. Human oversight applied.
                    </div>
                  </div>
                </div>
                <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              </div>

              {/* Scan list */}
              <div className="space-y-3">
                {[85, 62, 94].map((confidence, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 rounded-xl border border-slate-100 p-3.5 bg-white"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#FAFBFC] flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="h-2 w-2/3 bg-slate-100 rounded" />
                    </div>
                    <div className="h-2 w-20 rounded-full bg-slate-100 overflow-hidden shrink-0">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#0B3D91] to-[#00D4FF]"
                        style={{ width: `${confidence}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-[#0B3D91] shrink-0 w-8 text-right">
                      {confidence}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating badges — clean, subtle, no animation */}
      <div className="absolute -top-5 right-8 bg-white rounded-xl shadow-lg shadow-slate-200/50 border border-slate-100 p-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#0B3D91]">EU AI Act Verified</div>
            <div className="text-[10px] text-slate-400">Compliance ready</div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-4 left-8 bg-white rounded-xl shadow-lg shadow-slate-200/50 border border-slate-100 p-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#00D4FF]/10 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-[#00D4FF]" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#0B3D91]">Live Scanning</div>
            <div className="text-[10px] text-slate-400">3,421 pages today</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="landing-page flex min-h-screen flex-col relative overflow-hidden bg-white">
      <Navbar />

      {/* ═══════════════════════════════════════════
          HERO — Clean, confident, human-designed
          ═══════════════════════════════════════════ */}
      <section className="relative pt-24 sm:pt-32 lg:pt-40 pb-20 sm:pb-28 bg-gradient-to-b from-[#EAF4FF] to-[#F5FAFF]">
        <AmbientBackground />

        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00D4FF]/25 bg-white px-4 py-1.5 text-sm font-medium text-[#0B3D91] shadow-sm shadow-[#00D4FF]/5 mb-10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D4FF] opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00D4FF]" />
              </span>
              Now EU AI Act Compliant
            </div>

            {/* Headline */}
            <h1 className="text-[2.75rem] sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-[#0B3D91] mb-7">
              AI Content Transparency{" "}
              <span className="text-[#00D4FF]">Made Simple</span>
            </h1>

            {/* Subhead */}
            <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
              Add EU AI Act compliant transparency labels to your website in
              minutes. One script tag. Full compliance. Zero headaches.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="gap-2 bg-[#00D4FF] hover:bg-[#00c2e6] text-[#0B3D91] font-bold px-7 h-12 text-base shadow-lg shadow-[#00D4FF]/20"
                >
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-7 h-12 text-base border-slate-200 hover:border-[#0B3D91]/20 hover:bg-[#0B3D91]/[0.02] text-slate-600"
                >
                  View Demo
                </Button>
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-[2.5px] border-white bg-gradient-to-br from-[#E8ECF1] to-[#D3DDEA] flex items-center justify-center"
                  >
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <span className="font-semibold text-slate-700">4.9/5</span>
                <span>from 500+ teams</span>
              </div>
            </div>
          </div>

          {/* Mockup */}
          <div className="mt-16 sm:mt-20">
            <BrowserMockup />
          </div>
        </div>
      </section>

      {/* ── Trust Logos ── */}
      <section className="border-y border-slate-100 bg-[#FAFBFC] py-10">
        <div className="container">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 mb-6">
            Trusted by innovative teams worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4 opacity-35">
            {TRUST_LOGOS.map((logo) => (
              <div
                key={logo.name}
                className="flex items-center gap-2 text-slate-600 font-bold text-lg tracking-tight"
              >
                <span className="w-8 h-8 rounded bg-slate-200 flex items-center justify-center text-xs">
                  {logo.abbr}
                </span>
                {logo.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[#00D4FF]/8 mb-3">
                  <stat.icon className="w-5 h-5 text-[#00D4FF]" />
                </div>
                <div className="text-3xl font-extrabold text-[#0B3D91] mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 bg-[#F5F8FD]">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] text-[#00D4FF] mb-3">
              Features
            </span>
            <h2 className="text-3xl sm:text-[2.5rem] font-extrabold text-[#0B3D91] mb-4 tracking-tight">
              Everything you need to stay compliant
            </h2>
            <p className="text-lg text-slate-500">
              Powerful tools designed for legal teams, developers, and content
              creators — all in one platform.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-24">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] text-[#00D4FF] mb-3">
              How it Works
            </span>
            <h2 className="text-3xl sm:text-[2.5rem] font-extrabold text-[#0B3D91] mb-4 tracking-tight">
              Compliance in three simple steps
            </h2>
            <p className="text-lg text-slate-500">
              No complex setup. No engineering required. Get compliant in
              minutes, not months.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-[#00D4FF]/30 to-transparent" />
            {STEPS.map((step) => (
              <div key={step.number} className="relative text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white border border-slate-100 shadow-sm mb-6 relative z-10">
                  <span className="text-2xl font-black text-[#0B3D91]">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#0B3D91] mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-500 leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 bg-[#F5F8FD]">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] text-[#00D4FF] mb-3">
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-[2.5rem] font-extrabold text-[#0B3D91] mb-4 tracking-tight">
              Loved by compliance teams
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.author}
                className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-slate-600 leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0B3D91] to-[#00D4FF] flex items-center justify-center text-white text-sm font-bold">
                    {t.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">
                      {t.author}
                    </div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24">
        <div className="container">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0B3D91] to-[#071a3f] p-12 lg:p-20 text-center">
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-15"
                style={{
                  background:
                    "radial-gradient(circle, #00D4FF 0%, transparent 70%)",
                  filter: "blur(100px)",
                }}
              />
            </div>
            <div className="relative z-10 max-w-2xl mx-auto space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/8 px-4 py-1.5 text-sm font-medium text-[#00D4FF] border border-white/10">
                <Award className="w-4 h-4" />
                Start your free 14-day trial today
              </div>
              <h2 className="text-3xl sm:text-[2.5rem] font-extrabold text-white tracking-tight leading-tight">
                Ready to make your AI content transparent?
              </h2>
              <p className="text-lg text-slate-300">
                Join 10,000+ websites that trust TrustNode for EU AI Act
                compliance. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="gap-2 bg-[#00D4FF] hover:bg-[#00c2e6] text-[#0B3D91] font-bold px-8 h-12 text-base shadow-xl shadow-black/20"
                  >
                    Get Started Free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 h-12 text-base border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                  >
                    Talk to Sales
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-center gap-6 pt-3 text-sm text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Free 14-day trial
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  No credit card
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Cancel anytime
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-100 bg-white pt-16 pb-8">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-2">
              <Link
                href="/"
                className="flex items-center gap-2.5 font-bold text-xl text-[#0B3D91] mb-4"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#0B3D91] to-[#00D4FF]">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                TrustNode
              </Link>
              <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
                The easiest way to add EU AI Act compliant transparency labels
                to your website. Built for teams that value trust.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Product</h4>
              <ul className="space-y-2.5">
                {["Features", "Pricing", "Integrations", "Changelog"].map(
                  (item) => (
                    <li key={item}>
                      <span className="text-sm text-slate-500 hover:text-[#0B3D91] cursor-pointer transition-colors">
                        {item}
                      </span>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Company</h4>
              <ul className="space-y-2.5">
                {["About", "Blog", "Careers", "Contact"].map((item) => (
                  <li key={item}>
                    <span className="text-sm text-slate-500 hover:text-[#0B3D91] cursor-pointer transition-colors">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Legal</h4>
              <ul className="space-y-2.5">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                  (item) => (
                    <li key={item}>
                      <span className="text-sm text-slate-500 hover:text-[#0B3D91] cursor-pointer transition-colors">
                        {item}
                      </span>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400">
              &copy; {new Date().getFullYear()} TrustNode. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
