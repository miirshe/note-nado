import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getStripeSession } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { StripeSubscriptionCreationButton } from "@/app/components/submit-buttons";
const featureItems = [
  { name: "lorem ipsum something." },
  { name: "lorem ipsum something." },
  { name: "lorem ipsum something." },
  { name: "lorem ipsum something." },
];

async function getData(userId: string) {
  if (userId) {
    const data = await prisma.subscription.findUnique({
      where: {
        userId: userId,
      },
      select: {
        status: true,
        user: {
          select: {
            stripeCustomerId: true,
          },
        },
      },
    });

    return data;
  }
}
export default async function BillingPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const data = await getData(user?.id as string);

  async function createSubscription() {
    "use server";
    const dbUrl = await prisma.user.findUnique({
      where: {
        id: user?.id,
      },
      select: {
        stripeCustomerId: true,
      },
    });
    if (dbUrl?.stripeCustomerId) {
      throw new Error("Unable to get customer id ");
    }

    const subscriptionUrl = await getStripeSession({
      customerId: dbUrl?.stripeCustomerId as string,
      domainUrl: "http://localhost:3000",
      priceId: process.env.STRIPE_PRICE_ID as string,
    });
    return redirect(subscriptionUrl);
  }
  return (
    <div className="max-w-md mx-auto space-y-4">
      <Card className="flex flex-col">
        <CardContent className="py-8">
          <div>
            <h1 className="inline-flex text-sm font-semibold tracking-wide bg-primary/5 uppercase px-3 py-1 rounded-full">
              billing
            </h1>
          </div>

          <div className="mt-4 flex items-baseline text-6xl font-extrabold">
            $30{" "}
            <span className="ml-2 text-2xl text-muted-foreground ">/mo</span>
          </div>
          <p className="mt-7 text-lg text-muted-foreground">
            Write as many notes as you want for $30 a monthly
          </p>
        </CardContent>
        <div
          className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 sm:p-10 sm:pb-6
        rounded-lg m-1 space-y-6 bg-secondary"
        >
          <ul className="space-y-4">
            {featureItems.map((item, index) => {
              return (
                <li key={index} className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="text-green-500 h-5 w-5" />
                  </div>
                  <p className="ml-2 items-baseline">{item.name}</p>
                </li>
              );
            })}
          </ul>
          <form className="w-full" action={createSubscription}>
            <StripeSubscriptionCreationButton />
          </form>
        </div>
      </Card>
    </div>
  );
}
