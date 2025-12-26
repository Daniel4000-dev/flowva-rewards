"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { APP_ROUTES } from '../config/routes';
import { randomUUID } from "crypto";

// 1. Fetch User Data
export async function getRewardsData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile;
}

// 2. Logic: Claim Daily Streak
export async function claimDailyStreak() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { status: "error", message: "User not found" };

  // Fetch current profile to check date
  const { data: profile } = await supabase
    .from("profiles")
    .select("last_claim_date, current_streak, points_balance")
    .eq("id", user.id)
    .single();

  if (!profile) return { status: "error", message: "Profile not found" };

  const lastClaim = profile.last_claim_date ? new Date(profile.last_claim_date) : null;
  const today = new Date();
  
  // Check if already claimed today (Simple date comparison)
  if (lastClaim && lastClaim.toDateString() === today.toDateString()) {
    return { status: "error", message: "Already claimed today!" };
  }

  // Calculate new streak (reset if missed a day)
  const isConsecutive = lastClaim && 
    (today.getTime() - lastClaim.getTime() < 48 * 60 * 60 * 1000); // within 48 hours roughly
  
  const newStreak = isConsecutive ? profile.current_streak + 1 : 1;
  const pointsToAdd = 5; 

  // Update DB
  const { error } = await supabase
    .from("profiles")
    .update({
      current_streak: newStreak,
      points_balance: profile.points_balance + pointsToAdd,
      last_claim_date: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) return { status: "error", message: error.message };

  revalidatePath(APP_ROUTES.REWARDS);
  return { status: "success", points: pointsToAdd };
}

export async function claimSpotlightBonus() {
    // In a real app, you'd check if they actually signed up.
    // For this demo, we just award the points.
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { status: "error" };

    const { error } = await supabase.rpc('increment_points', { 
        user_id: user.id, 
        amount: 50 
    }); // Assuming you have an RPC or use standard update like above

    if (error) return { status: "error", message: error.message };
    revalidatePath("/dashboard/rewards");
    return { status: "success" };
}

export async function checkStackStatus() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Check if user has items in a 'stacks' table
  // const { count } = await supabase.from('stacks').select('*', { count: 'exact', head: true }).eq('user_id', user?.id);
  
  const hasStack = false; // Hardcoded to match your "Empty" screenshot
  return { hasStack };
}

export async function submitReclaimProof(formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
      return { status: "error", message: "You must be logged in." };
  }

  const email = formData.get("reclaim_email") as string;
  const file = formData.get("proof_screenshot") as File;

  if (!email || !file || file.size === 0) {
    return { status: "error", message: "Please provide a valid email and screenshot." };
  }

  if (!file.type.startsWith("image/")) {
      return { status: "error", message: "File must be an image." };
  }
  if (file.size > 5 * 1024 * 1024) {
      return { status: "error", message: "File size must be under 5MB." };
  }

  try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase
        .storage
        .from('proofs')
        .upload(filePath, file, {
            upsert: false
        });

      if (uploadError) throw uploadError;

      // 6. Save Record in Database
      const { error: dbError } = await supabase
        .from('claim_requests')
        .insert({
            user_id: user.id,
            email_used: email,
            screenshot_path: filePath,
            status: 'pending'
        });

      if (dbError) throw dbError;

      revalidatePath("/rewards");
      return { status: "success", message: "Claim submitted for review!" };

  } catch (error: any) {
      console.error("Submission Error:", error);
      return { status: "error", message: "Failed to upload proof. Please try again." };
  }
}

export async function getAvailableRewards() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("rewards")
    .select("*")
    .order("id", { ascending: true }); // Keep them in order

  if (error) {
    console.error("Error fetching rewards:", error);
    return [];
  }

  return data;
}