"use client";
import { cn } from "@/lib/utils";
import { Home, Settings, CreditCard } from "lucide-react";
import Link from "next/link";
import {usePathname} from "next/navigation"
const navItem = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
];
export default function DashboardNav() {
    const pathName = usePathname();
  return (
    <nav className="grid items-start gap-2">
      {navItem.map((item, index) => {
        return (
          <Link href={item.href} key={index}>
            <span
              className={cn(
                "group flex  items-center px-4 py-2 hover:bg-accent hover:text-accent-foreground rounded-lg text-sm font-medium",
                pathName == item.href ? "bg-accent" : "bg-transparent"
              )}
            >
              <item.icon className="w-4 h-4 mr-2 text-primary" />
              <span>{item.name}</span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
