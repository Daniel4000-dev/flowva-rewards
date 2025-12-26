import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CloudUpload, X } from "lucide-react";
import { submitReclaimProof } from "@/actions/rewards";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export function ReclaimFormModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const res = await submitReclaimProof(formData);
    setLoading(false);
    
    if (res.status === 'success') {
        toast.success("Claim Submitted!");
        onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white">
        <div className="p-6 pb-0">
            <div className="flex justify-between items-center mb-4">
                <DialogTitle className="text-xl font-bold text-slate-900">Claim Your 25 Points</DialogTitle>
            </div>
            
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                Sign up for Reclaim (free, no payment needed), then fill the form below:<br/>
                1️⃣ Enter your Reclaim sign-up email.<br/>
                2️⃣ Upload a screenshot of your Reclaim profile
            </p>
            <p className="text-sm text-slate-600 mb-6">
                After verification, you'll get <span className="font-bold text-violet-600">25 Flowva Points!</span> 🎉😊
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="reclaim_email" className="font-semibold text-slate-700">Email used on Reclaim</Label>
                    <Input id="reclaim_email" name="reclaim_email" placeholder="user@example.com" required />
                </div>

                <div className="space-y-2">
                    <Label className="font-semibold text-slate-700">Upload screenshot (mandatory)</Label>
                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors relative">
                        <Input 
                            type="file" 
                            name="proof_screenshot" 
                            className="absolute inset-0 opacity-0 cursor-pointer" 
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            required
                        />
                        <CloudUpload className="h-8 w-8 text-slate-400 mb-2" />
                        <span className="text-sm text-slate-500 font-medium">
                            {file ? file.name : "Choose file"}
                        </span>
                    </div>
                </div>

                <div className="flex gap-3 pt-4 pb-6">
                    <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="flex-1">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading} className="flex-1 bg-[#7E22CE] hover:bg-violet-800 text-white">
                        {loading ? "Submitting..." : "Submit Claim"}
                    </Button>
                </div>
            </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}