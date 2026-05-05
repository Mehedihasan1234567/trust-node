import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TrustNode - EU AI Act Transparency Widget",
  description:
    "Multi-tenant SaaS platform for AI content transparency and EU AI Act compliance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}

          <Script src="/widget.js" data-api-key="tn_eac1c7447be4490b91616b45b4c48792"
            strategy="afterInteractive"
          />
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
