import { z } from "zod";

// ──── Enums ────

export const UserRoleEnum = z.enum(["OWNER", "ADMIN", "MEMBER", "VIEWER"]);
export type UserRole = z.infer<typeof UserRoleEnum>;

export const ContentTypeEnum = z.enum([
  "TEXT",
  "IMAGE",
  "VIDEO",
  "AUDIO",
  "DEEPFAKE",
]);
export type ContentType = z.infer<typeof ContentTypeEnum>;

export const ScanStatusEnum = z.enum([
  "PENDING",
  "PROCESSING",
  "COMPLETED",
  "FAILED",
]);
export type ScanStatus = z.infer<typeof ScanStatusEnum>;

export const VerdictEnum = z.enum([
  "AI_GENERATED",
  "AI_MANIPULATED",
  "HUMAN_CREATED",
  "UNCERTAIN",
]);
export type Verdict = z.infer<typeof VerdictEnum>;

export const PlanEnum = z.enum(["FREE", "STARTER", "PRO", "ENTERPRISE"]);
export type Plan = z.infer<typeof PlanEnum>;

export const WebsiteVerificationStatusEnum = z.enum([
  "PENDING",
  "VERIFIED",
  "FAILED",
]);
export type WebsiteVerificationStatus = z.infer<
  typeof WebsiteVerificationStatusEnum
>;

export const WidgetThemeEnum = z.enum(["LIGHT", "DARK", "AUTO"]);
export type WidgetTheme = z.infer<typeof WidgetThemeEnum>;

export const WidgetPositionEnum = z.enum([
  "TOP_BANNER",
  "BOTTOM_BAR",
  "INLINE_ONLY",
  "MODAL_ONLY",
]);
export type WidgetPosition = z.infer<typeof WidgetPositionEnum>;

// ──── Validation Schemas ────

export const DomainSchema = z
  .string()
  .min(3)
  .max(253)
  .regex(
    /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
    "Invalid domain format"
  );

export const CreateWebsiteSchema = z.object({
  domain: DomainSchema.transform((d) => d.toLowerCase().trim()),
  displayName: z.string().min(1).max(100).optional(),
});

export const UpdateWidgetConfigSchema = z.object({
  theme: WidgetThemeEnum.optional(),
  position: WidgetPositionEnum.optional(),
  autoScan: z.boolean().optional(),
  scanText: z.boolean().optional(),
  scanImages: z.boolean().optional(),
  disclosurePrefix: z.string().max(200).optional(),
  language: z.string().min(2).max(5).optional(),
});

export const ScanRequestSchema = z.object({
  websiteId: z.string().uuid(),
  pageUrl: z.string().url().max(2048),
  items: z
    .array(
      z.object({
        contentHash: z.string().min(1),
        contentType: ContentTypeEnum,
        contentPreview: z.string().max(200).optional(),
        contentData: z.string().optional(),
      })
    )
    .min(1)
    .max(50),
});

// ──── Common Types ────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface WidgetScanResult {
  id: string;
  contentHash: string;
  verdict: Verdict;
  confidence: number | null;
  disclosureMsg: string;
  scanStatus: ScanStatus;
}
