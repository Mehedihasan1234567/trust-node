"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Globe, ScanSearch } from "lucide-react";

interface MetricsSectionProps {
  complianceScore: number;
  websiteCount: number;
  scanCount: number;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export function MetricsSection({
  complianceScore,
  websiteCount,
  scanCount,
}: MetricsSectionProps) {
  const metrics = [
    {
      id: "compliance",
      label: "Compliance Health Score",
      value: `${complianceScore}%`,
      description: "Based on latest AI audits",
      icon: ShieldCheck,
      accent: true,
    },
    {
      id: "domains",
      label: "Active Domains",
      value: websiteCount,
      description: "Registered & verified websites",
      icon: Globe,
      accent: false,
    },
    {
      id: "audits",
      label: "Total AI Audits",
      value: scanCount,
      description: "Scans completed to date",
      icon: ScanSearch,
      accent: false,
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-4 md:grid-cols-3"
    >
      {metrics.map((metric) => (
        <motion.div
          key={metric.id}
          variants={item}
          className={`group relative overflow-hidden rounded-xl border border-[#333333] bg-[#242424] p-6 transition-all duration-300 ${
            metric.accent
              ? "shadow-[0_0_40px_-12px_rgba(0,255,194,0.12)]"
              : "hover:border-[#444444]"
          }`}
        >
          {metric.accent && (
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#00FFC2] to-transparent opacity-60" />
          )}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-[#A0A0A0]">{metric.label}</p>
              <h3
                className={`text-3xl font-bold tracking-tight ${
                  metric.accent ? "text-[#00FFC2]" : "text-white"
                }`}
              >
                {metric.value}
              </h3>
              <p className="text-xs text-[#A0A0A0]">{metric.description}</p>
            </div>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                metric.accent ? "bg-[#00FFC2]/10" : "bg-[#1C1C1C]"
              }`}
            >
              <metric.icon
                className={`h-5 w-5 ${
                  metric.accent ? "text-[#00FFC2]" : "text-[#A0A0A0]"
                }`}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
