import { Button } from "@/components/ui/button";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";

export default function Home() {
  return (
    <section className="flex items-center justify-center bg-background h-[90vh]">
      <div
        className="relative  items-center w-full mx-auto px-5  lg:py-16 md:px-12
      max-w-7xl"
      >
        <div className="max-w-3xl mx-auto text-center">
          <div className="space-y-7">
            <span className="w-auto px-6 py-3 rounded-full bg-secondary">
              <span className="text-sm font-medium ">
                Sort all you notes easly
              </span>
            </span>
            <h1 className="text-3xl font-medium lg:text-6xl lg:font-extrabold tracking-tighter">
              Create Note with easy
            </h1>
            <p className="max-w-7xl lg:max-w-5xl mx-auto text-base lg:text-lg tracking-tight text-secondary-foreground ">
              Notenado revolutionizes the way you capture and organize your
              thoughts. Seamlessly create, edit, and manage your notes with
              unparalleled ease and efficiency.
            </p>
            <div className="flex justify-center items-center max-w-sm mx-auto">
              <RegisterLink>
                <Button size="lg" className="w-full text-secondary-foreground">
                  Sign up for free
                </Button>
              </RegisterLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
