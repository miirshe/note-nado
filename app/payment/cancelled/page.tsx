import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { XIcon } from "lucide-react";
import Link from "next/link";

export default function CancelledPage() {
  return (
    <div className="w-full min-h-[80vh] flex justify-center items-center">
      <Card className="w-[350px]">
        <div className="p-6">
          <div className="w-full flex items-center justify-center">
            <XIcon className="w-10 h-10 rounded-full p-2 bg-red-500/20 text-red-500" />
          </div>
          <div className="mt-3 w-full text-center sm:mt-5">
            <h1 className="leading-9 font-medium text-lg">Payment Failed</h1>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                No worries, you want be changed, please try again.
              </p>
            </div>
            <div className="w-full mt-5 sm:mt-6">
              <Button className="w-full" asChild>
                <Link href="/dashboard">Go back to dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
