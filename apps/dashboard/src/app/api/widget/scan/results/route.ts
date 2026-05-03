import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const ids = request.nextUrl.searchParams.get("ids");

  if (!ids) {
    return NextResponse.json(
      { success: false, error: { code: "MISSING_IDS", message: "ids parameter required" } },
      { status: 400 }
    );
  }

  const scanIds = ids.split(",").filter(Boolean);

  if (scanIds.length === 0 || scanIds.length > 100) {
    return NextResponse.json(
      { success: false, error: { code: "INVALID_IDS", message: "Provide 1-100 comma-separated scan IDs" } },
      { status: 400 }
    );
  }

  const results = await prisma.scanResult.findMany({
    where: { id: { in: scanIds } },
    select: {
      id: true,
      contentHash: true,
      verdict: true,
      confidence: true,
      disclosureMsg: true,
      scanStatus: true,
    },
  });

  return NextResponse.json({
    success: true,
    data: { results },
  });
}
