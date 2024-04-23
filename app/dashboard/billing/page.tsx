import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getStripeSession, stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import {
  StripePortal,
  StripeSubscriptionCreationButton,
} from "@/app/components/submit-buttons";
import { unstable_noStore as noStore } from "next/cache";
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
    if (!dbUrl?.stripeCustomerId) {
      throw new Error("Unable to get customer id ");
    }

    const subscriptionUrl = await getStripeSession({
      customerId: dbUrl?.stripeCustomerId as string,
      domainUrl: "http://localhost:3000",
      priceId: process.env.STRIPE_PRICE_ID as string,
    });
    return redirect(subscriptionUrl);
  }

  async function createCustomerPortal() {
    "use server";
    const session = await stripe.billingPortal.sessions.create({
      customer: data?.user.stripeCustomerId as string,
      return_url:
        process.env.NODE_ENV === "production"
          ? (process.env.PRODUCTION_URL as string)
          : "http://localhost:3000/dashboard",
    });

    return redirect(session.url);
  }

  if (data?.status === "active") {
    return (
      <div className="grid items-start gap-8">
        <div className="flex items-center justify-between px-2">
          <div className="grid gap-1">
            <h1 className="text-3xl md:text-4xl ">Subscription</h1>
            <p className="text-lg text-muted-foreground">
              Settings reagding your subscription
            </p>
          </div>
        </div>

        <Card className="w-full lg:w-2/3">
          <CardHeader>
            <CardTitle>Edit Subscription</CardTitle>
            <CardDescription>
              Click on the button below, this will give you the opportunity to
              change your payment details and view your statement at the same
              time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createCustomerPortal}>
              <StripePortal />
            </form>
          </CardContent>
        </Card>
      </div>
    );
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
