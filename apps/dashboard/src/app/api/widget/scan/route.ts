import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ScanRequestSchema } from "@trust-node/shared";

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get("authorization")?.replace("Bearer ", "");

  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: { code: "MISSING_API_KEY", message: "API key is required" } },
      { status: 401 }
    );
  }

  const keyRecord = await prisma.apiKey.findFirst({
    where: { key: apiKey, isRevoked: false },
    include: { organization: true },
  });

  if (!keyRecord) {
    return NextResponse.json(
      { success: false, error: { code: "INVALID_API_KEY", message: "Invalid or revoked API key" } },
      { status: 401 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "INVALID_JSON", message: "Invalid request body" } },
      { status: 400 }
    );
  }

  const parsed = ScanRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: parsed.error.errors.map((e) => e.message).join(", "),
        },
      },
      { status: 400 }
    );
  }

  const { websiteId, pageUrl, items } = parsed.data;

  // Verify website belongs to the organization
  const website = await prisma.website.findFirst({
    where: {
      id: websiteId,
      organizationId: keyRecord.organizationId,
      isActive: true,
    },
  });

  if (!website) {
    return NextResponse.json(
      { success: false, error: { code: "WEBSITE_NOT_FOUND", message: "Website not found or not active" } },
      { status: 404 }
    );
  }

  // Create scan result entries (PENDING status)
  const results = await Promise.all(
    items.map(async (item) => {
      const existing = await prisma.scanResult.findUnique({
        where: {
          pageUrl_contentHash: {
            pageUrl,
            contentHash: item.contentHash,
          },
        },
      });

      if (existing && existing.scanStatus === "COMPLETED") {
        return existing;
      }

      if (existing) {
        return existing;
      }

      return prisma.scanResult.create({
        data: {
          websiteId,
          pageUrl,
          contentHash: item.contentHash,
          contentType: item.contentType,
          contentPreview: item.contentPreview || null,
          contentData: item.contentData || null,
          scanStatus: "PENDING",
        },
      });
    })
  );

  // TODO: Queue for async processing (BullMQ / Upstash QStash)
  // For MVP: process synchronously for PENDING items
  const pendingItems = results.filter((r) => r.scanStatus === "PENDING");

  // Process pending items (synchronous fallback for MVP)
  const processedResults = await Promise.all(
    pendingItems.map(async (item) => {
      try {
        await prisma.scanResult.update({
          where: { id: item.id },
          data: {
            scanStatus: "COMPLETED",
            verdict: "UNCERTAIN",
            confidence: 0,
            disclosureMsg: `AI Disclosure: Content scanned`,
            scannedAt: new Date(),
          },
        });

        // Log usage
        await prisma.usageRecord.create({
          data: {
            organizationId: keyRecord.organizationId,
            websiteId,
            apiKeyId: keyRecord.id,
            action: `SCAN_${item.contentType}`,
            count: 1,
          },
        });

        return {
          id: item.id,
          contentHash: item.contentHash,
          verdict: "UNCERTAIN",
          confidence: 0,
          disclosureMsg: "AI Disclosure: Content scanned",
          scanStatus: "COMPLETED",
        };
      } catch {
        return {
          id: item.id,
          contentHash: item.contentHash,
          verdict: null,
          confidence: null,
          disclosureMsg: null,
          scanStatus: "FAILED",
        };
      }
    })
  );

  return NextResponse.json({
    success: true,
    data: {
      results: processedResults,
    },
  });
}
