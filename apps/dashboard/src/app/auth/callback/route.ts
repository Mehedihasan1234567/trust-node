import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data: authData, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && authData?.user) {
      const user = authData.user;
      const email = user.email || "";
      const name = user.user_metadata?.full_name || user.user_metadata?.name || email.split("@")[0] || "User";

      try {
        // Check if user exists in Prisma
        let existingUser = await prisma.user.findUnique({
          where: { id: user.id },
        });

        if (!existingUser) {
          // If not found by ID, try to find by email
          existingUser = await prisma.user.findUnique({
            where: { email: email },
          });

          if (existingUser) {
            // User exists by email but has a different ID
            // Try to update the ID to match Supabase's new ID
            try {
              await prisma.user.update({
                where: { email: email },
                data: { id: user.id },
              });
            } catch (updateError) {
              console.error("Could not update user ID. Foreign key constraint might be preventing it.", updateError);
            }
          } else {
            const baseSlug = email.split("@")[0]?.toLowerCase().replace(/[^a-z0-9]/g, "-") || "org";
            const randomSuffix = Math.random().toString(36).substring(2, 8);
            const slug = `${baseSlug}-${randomSuffix}`;

            try {
              await prisma.user.create({
                data: {
                  id: user.id,
                  email: email,
                  name: name,
                },
              });

              await prisma.organization.create({
                data: {
                  name: name || email,
                  slug,
                  members: {
                    create: {
                      userId: user.id,
                      role: "OWNER",
                    },
                  },
                },
              });
            } catch (createError: any) {
              if (createError.code === 'P2002') {
                console.log('User already exists (caught P2002). Skipping creation.');
              } else {
                throw createError;
              }
            }
          }
        }
      } catch (dbError) {
        console.error("Database sync error in OAuth callback:", dbError);
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = !!process.env.VERCEL_URL;
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent("Authentication failed. Please try again.")}`);
}
