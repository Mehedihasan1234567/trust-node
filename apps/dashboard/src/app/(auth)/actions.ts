"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    name: formData.get("name") as string,
  };

  const { data: authData, error } = await supabase.auth.signUp(data);

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  if (authData.user) {
    const slug = data.email.split("@")[0]?.toLowerCase().replace(/[^a-z0-9]/g, "-") || "org";

    // Sync user to Prisma
    await prisma.user.upsert({
      where: { id: authData.user.id },
      update: { email: data.email, name: data.name },
      create: {
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
