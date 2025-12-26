import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function StackEmptyModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm text-center flex flex-col items-center p-8">
        <div className="h-16 w-16 bg-violet-100 rounded-full flex items-center justify-center mb-4">
            <Layers className="h-8 w-8 text-violet-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Share Your Stack</h2>
        <p className="text-slate-500 text-sm mb-6 max-w-[240px]">
            You have no stack created yet, go to Tech Stack to create one.
        </p>
        {/* Optional: Add a button to redirect */}
        <Button asChild className="bg-[#7E22CE] text-white">
            <Link href="/tech-stack">Go to Tech Stack</Link>
        </Button>
      </DialogContent>
    </Dialog>
  );
}