"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const { data: authData, error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        name: formData.get("name") as string,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "https://trust-node-dashboard.vercel.app"}/auth/callback`,
    },
  });

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    name: formData.get("name") as string,
  };

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  if (authData.user) {
    const baseSlug = data.email.split("@")[0]?.toLowerCase().replace(/[^a-z0-9]/g, "-") || "org";
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const slug = `${baseSlug}-${randomSuffix}`;

    try {
      // Sync user to Prisma
      let existingUser = await prisma.user.findUnique({
        where: { id: authData.user.id },
      });

      if (!existingUser) {
        existingUser = await prisma.user.findUnique({
          where: { email: data.email },
        });

        if (existingUser) {
          // User exists with this email but a different ID
          try {
            await prisma.user.update({
              where: { email: data.email },
              data: { id: authData.user.id, name: data.name },
            });
          } catch (e) {
            console.error("Failed to update user ID during signup", e);
          }
        } else {
          await prisma.user.create({
            data: {
              id: authData.user.id,
              email: data.email,
              name: data.name,
            },
          });

          await prisma.organization.create({
            data: {
              name: data.name || data.email,
              slug,
              members: {
                create: {
                  userId: authData.user.id,
                  role: "OWNER",
                },
              },
            },
          });
        }
      } else {
        // User exists by ID, update their details
        await prisma.user.update({
          where: { id: authData.user.id },
          data: { email: data.email, name: data.name },
        });
      }
    } catch (dbError: any) {
      if (dbError.code === 'P2002') {
        console.log("User already exists (caught P2002 in signup). Skipping creation.");
      } else {
        console.error("Database sync error:", dbError);
        redirect(`/signup?error=${encodeURIComponent("Failed to setup user account. Please try again.")}`);
      }
    }
  }

  // If email confirmation is required, user has no session yet
  if (!authData.session) {
    redirect(
      "/login?message=" +
        encodeURIComponent(
          "Account created! Please check your email to confirm your account before signing in."
        )
    );
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || (host?.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (data.url) {
    redirect(data.url);
  }

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }
}
