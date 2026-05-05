"use client";

import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileSearch } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

type Scan = {
  id: string;
  pageUrl: string;
  contentType: string;
  verdict: string | null;
  scanStatus: string;
  scannedAt: Date | null;
  createdAt: Date;
  website: { domain: string };
};

interface AuditTrailTableProps {
  scans: Scan[];
}

export function AuditTrailTable({ scans }: AuditTrailTableProps) {
  const getVerdictBadge = (verdict: string | null, scanStatus: string) => {
    if (scanStatus !== "COMPLETED") {
      return (
        <Badge variant="outline" className="border-[#333333] text-[#A0A0A0]">
          {scanStatus}
        </Badge>
      );
    }

    switch (verdict) {
      case "HUMAN_CREATED":
        return <Badge variant="mint">Compliant</Badge>;
      case "AI_GENERATED":
      case "AI_MANIPULATED":
        return <Badge variant="crimson">Flagged</Badge>;
      default:
        return (
          <Badge variant="outline" className="border-[#333333] text-[#A0A0A0]">
            {verdict?.replace("_", " ") || "Pending"}
          </Badge>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
      className="rounded-xl border border-[#333333] bg-[#242424]"
    >
      <div className="flex items-center justify-between border-b border-[#333333] px-6 py-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
          <p className="text-sm text-[#A0A0A0]">
            Latest AI scans across your domains
          </p>
        </div>
      </div>

      {scans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1C1C1C]">
            <FileSearch className="h-6 w-6 text-[#A0A0A0]" />
          </div>
          <h4 className="mt-4 text-sm font-medium text-white">No scans yet</h4>
          <p className="mt-1 max-w-sm text-sm text-[#A0A0A0]">
            Add a domain and run your first AI audit to see results here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-[#333333] hover:bg-transparent">
                <TableHead className="text-[#A0A0A0]">Domain</TableHead>
                <TableHead className="text-[#A0A0A0]">Page URL</TableHead>
                <TableHead className="text-[#A0A0A0]">Content Type</TableHead>
                <TableHead className="text-[#A0A0A0]">Status</TableHead>
                <TableHead className="text-right text-[#A0A0A0]">
                  Date
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scans.map((scan) => (
                <TableRow
                  key={scan.id}
                  className="border-[#333333] transition-colors hover:bg-[#1C1C1C]/50"
                >
                  <TableCell className="font-medium text-white">
                    {scan.website.domain}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-[#A0A0A0]">
                    {scan.pageUrl}
                  </TableCell>
                  <TableCell className="text-[#A0A0A0]">
                    {scan.contentType}
                  </TableCell>
                  <TableCell>
                    {getVerdictBadge(scan.verdict, scan.scanStatus)}
                  </TableCell>
                  <TableCell className="text-right text-[#A0A0A0]">
                    {scan.scannedAt
                      ? formatDateTime(scan.scannedAt)
                      : formatDateTime(scan.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </motion.div>
  );
}
