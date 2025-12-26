import { Check } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export function StreakSuccessModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  
  useEffect(() => {
    if (open) {
      // Fire confetti when modal opens
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center flex flex-col items-center justify-center p-10 gap-4">
        {/* Hidden title for accessibility if not desired visually, or direct use */}
        <DialogTitle className="sr-only">Success!</DialogTitle>

        <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-2">
          <Check className="h-10 w-10 text-green-600" strokeWidth={4} />
        </div>
        
        <h2 className="text-2xl font-bold text-violet-700">Level Up! 🎉</h2>
        <div className="text-5xl font-extrabold text-[#D946EF] drop-shadow-sm">
          +5 Points
        </div>
        <div className="flex gap-2 text-2xl">✨ 💎 🎯</div>
        
        <p className="text-slate-500 text-sm max-w-[200px]">
          You've claimed your daily points! Come back tomorrow for more!
        </p>
      </DialogContent>
    </Dialog>
  );
}