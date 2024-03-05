import Link from "next/link";
import { ThemeToggle } from "./Theme-toggle";
import { Button } from "@/components/ui/button";

export default function Navbar(){
    return (
        <nav className="bg-background border-b h-[10vh] flex items-center">
            <div className="container flex items-center justify-between">
                <Link href="">
                    <h1 className="text-3xl tracking-widest font-bold">NoteNado</h1>
                </Link>
                <div className="flex items-center gap-x-5">
                    <ThemeToggle/>
                    <div className="flex items-center gap-x-5">
                        <Button>Sign In</Button>
                        <Button variant="secondary">Sign Up</Button>
                    </div>
                </div>
            </div>

        </nav>
    )
}