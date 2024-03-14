import { ReactNode } from "react";
import DashboardNav from "../components/dashboard-nav";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "../../lib/db";
import { stripe } from "@/lib/stripe";
interface childrenProps {
  children: ReactNode;
}
async function getData({
  email,
  id,
  firstName,
  lastName,
  profileImage,
}: {
  email: string;
  id: string;
  firstName: string | undefined | null;
  lastName: string | undefined | null;
  profileImage: string | undefined | null;
}) {
  if (id) {
    const name = `${firstName ?? ""}  ${lastName ?? ""}`;
    const user = await prisma.user.findUnique({
      where: { id: id },
      select: { id: true, stripeCustomerId: true },
    });
    if (!user) {
      await prisma.user.create({
        data: {
          id: id,
          email: email,
          name: name,
        },
      });
    }
    if (!user?.stripeCustomerId) {
      const data = await stripe.customers.create({
        email: email,
      });

      await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          stripeCustomerId: data.id,
        },
      });
    }
  }
}
export default async function DashboardLayout({
  children,
}: Readonly<childrenProps>) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) {
    return redirect("/");
  }

  await getData({
    email: user?.email as string,
    id: user?.id as string,
    firstName: user?.given_name as string,
    lastName: user?.family_name as string,
    profileImage: user?.picture as string,
  });
  return (
    <div className="flex flex-col space-y-6 mt-10">
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] md:flex flex-col">
          <DashboardNav />
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
