import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import {
  RegisterLink,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import UserNav from "./user-nav";
export default async function Navbar() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <nav className="bg-background border-b h-[10vh] flex items-center">
      <div className="container flex items-center justify-between">
        <Link href="">
          <h1 className="text-base font-medium tracking-tight md:text-3xl md:tracking-widest md:font-bold">
            Note<span className="text-primary">Nado</span>
          </h1>
        </Link>
        <div className="flex items-center gap-x-5">
          <ThemeToggle />
          {(await isAuthenticated()) ? (
            <UserNav
              email={user?.email as string}
              name={user?.given_name as string}
              image={user?.picture as string}
            />
          ) : (
            <div className="flex items-center gap-x-5">
              <LoginLink>
                <Button>Sign In</Button>
              </LoginLink>
              <RegisterLink>
                <Button variant="secondary">Sign Up</Button>
              </RegisterLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
