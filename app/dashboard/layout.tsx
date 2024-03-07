import { ReactNode } from "react";
import DashboardNav from "../components/dashboard-nav"
interface childrenProps {
  children: ReactNode;
}
export default function DashboardLayout({ children }: Readonly<childrenProps>) {
  return (
    <div className="flex flex-col space-y-6 mt-10">
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] md:flex flex-col">
            <DashboardNav/>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
