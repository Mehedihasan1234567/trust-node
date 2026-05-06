import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let membership = await prisma.organizationMember.findFirst({
    where: { userId: user.id },
    include: { organization: true },
  });

  if (!membership) {
    // Prevent infinite redirect loop by creating the missing organization
    const email = user.email || "";
    const name = user.user_metadata?.full_name || user.user_metadata?.name || email.split("@")[0] || "User";
    const baseSlug = email.split("@")[0]?.toLowerCase().replace(/[^a-z0-9]/g, "-") || "org";
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const slug = `${baseSlug}-${randomSuffix}`;

    // Ensure the user exists in Prisma first
    let existingUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!existingUser) {
      existingUser = await prisma.user.findUnique({
        where: { email: email },
      });

      if (existingUser) {
        try {
          await prisma.user.update({
            where: { email: email },
            data: { id: user.id },
          });
        } catch (e) {
          console.error("Failed to update user ID in layout", e);
        }
      } else {
        try {
          await prisma.user.create({
            data: {
              id: user.id,
              email: email,
              name: name,
            },
          });
        } catch (e: any) {
          if (e.code !== 'P2002') throw e;
        }
      }
    }

    const org = await prisma.organization.create({
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

    membership = await prisma.organizationMember.findFirst({
      where: { userId: user.id, organizationId: org.id },
      include: { organization: true },
    });
  }

  const org = membership!.organization;

  return (
    <div className="dashboard flex min-h-screen bg-[#121212]">
      <DashboardSidebar org={org} user={user} />
      <div className="flex flex-1 flex-col">
        <DashboardHeader org={org} user={user} />
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
