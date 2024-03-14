import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import SubmitButton from "@/app/components/submit-buttons";
import { revalidatePath } from "next/cache";
async function getData(userId: string) {
 if(userId){
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      name: true,
      email: true,
      colorScheme: true,
    },
  });

  return data;
 }
}
export default async function Settings() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const data = await getData(user?.id as string);

  async function postData(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const colorScheme = formData.get("colorScheme") as string;
    await prisma.user.update({
      where: {
        id: user?.id as string,
      },
      data: {
        name: name ?? undefined,
        colorScheme: colorScheme ?? undefined,
      },
    });
    revalidatePath('/', "layout");
  }
  return (
    <div className="grid items-start gap-8">
      <div className="flex items-center justify-between px-3">
        <div className="grid gap-1">
          <h1 className="text-xl md:text-2xl tracking-tighter capitalize">
            settings
          </h1>
          <p className="text-lg text-muted-foreground">Your profile settings</p>
        </div>
      </div>

      <Card>
        <form className="p-2" action={postData}>
          <CardHeader>
            <CardTitle>General Data</CardTitle>
            <CardDescription>
              please provide general information about yourself. please do not
              forget to save{" "}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="space-y-1">
                <Label>You Name</Label>
                <Input
                  name="name"
                  id="name"
                  type="text"
                  placeholder="Your name"
                  defaultValue={data?.name || undefined}
                />
              </div>
              <div className="space-y-1">
                <Label>You Email</Label>
                <Input
                  name="email"
                  id="email"
                  type="text"
                  placeholder="Your email"
                  disabled
                  defaultValue={data?.email || undefined}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="color">Color Scheme</Label>
                <Select
                  name="colorScheme"
                  defaultValue={data?.colorScheme || undefined}
                >
                  <SelectTrigger id="color">
                    <SelectValue placeholder="Select a color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="theme-green">Green</SelectItem>
                    <SelectItem value="theme-blue">Blue</SelectItem>
                    <SelectItem value="theme-violet">Violet</SelectItem>
                    <SelectItem value="theme-yellow">Yellow</SelectItem>
                    <SelectItem value="theme-orange">Orange</SelectItem>
                    <SelectItem value="theme-red">Red</SelectItem>
                    <SelectItem value="theme-rose">Rose</SelectItem>
                    <SelectItem value="theme-zinc">Zinc</SelectItem>
                    <SelectItem value="theme-slate">Slate</SelectItem>
                    <SelectItem value="theme-stone">Stone</SelectItem>
                    <SelectItem value="theme-gray">Gray</SelectItem>
                    <SelectItem value="theme-neutral">Neutral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
