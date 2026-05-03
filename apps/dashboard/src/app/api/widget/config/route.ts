import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain");
  const apiKey = request.headers.get("authorization")?.replace("Bearer ", "");

  if (!domain) {
    return NextResponse.json(
      { success: false, error: { code: "MISSING_DOMAIN", message: "Domain parameter is required" } },
      { status: 400 }
    );
  }

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

  // Clean domain: remove protocol and path
  const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "").trim();

  const website = await prisma.website.findFirst({
    where: {
      domain: cleanDomain,
      organizationId: keyRecord.organizationId,
      isActive: true,
      verification: "VERIFIED",
    },
    include: { widgetConfig: true },
  });

  if (!website || !website.widgetConfig) {
    return NextResponse.json(
      { success: false, error: { code: "DOMAIN_NOT_REGISTERED", message: "Domain not registered or not verified" } },
      { status: 403 }
    );
  }

  // Update last used timestamp
  await prisma.apiKey.update({
    where: { id: keyRecord.id },
    data: { lastUsedAt: new Date() },
  });

  return NextResponse.json({
    success: true,
    data: {
      websiteId: website.id,
      theme: website.widgetConfig.theme,
      position: website.widgetConfig.position,
      autoScan: website.widgetConfig.autoScan,
      scanText: website.widgetConfig.scanText,
      scanImages: website.widgetConfig.scanImages,
      disclosurePrefix: website.widgetConfig.disclosurePrefix,
      language: website.widgetConfig.language,
    },
  });
}
