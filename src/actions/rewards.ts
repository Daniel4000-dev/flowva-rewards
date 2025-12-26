"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { APP_ROUTES } from '../config/routes';

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

export async function claimDailyStreak() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { status: "error", message: "User not found" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("last_claim_date, current_streak, points_balance")
    .eq("id", user.id)
    .single();

  if (!profile) return { status: "error", message: "Profile not found" };

  const lastClaim = profile.last_claim_date ? new Date(profile.last_claim_date) : null;
  const today = new Date();
  
  if (lastClaim && lastClaim.toDateString() === today.toDateString()) {
    return { status: "error", message: "Already claimed today!" };
  }

  const isConsecutive = lastClaim && 
    (today.getTime() - lastClaim.getTime() < 48 * 60 * 60 * 1000); 
  
  const newStreak = isConsecutive ? profile.current_streak + 1 : 1;
  const pointsToAdd = 5; 

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
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { status: "error" };

    const { error } = await supabase.rpc('increment_points', { 
        user_id: user.id, 
        amount: 50 
    }); 

    if (error) return { status: "error", message: error.message };
    revalidatePath("/dashboard/rewards");
    return { status: "success" };
}

export async function checkStackStatus() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const hasStack = false; 
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
      return { status: "error", message: "Failed to upload proof. Please try again." };
  }
}

export async function getAvailableRewards() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("rewards")
    .select("*")
    .order("id", { ascending: true }); 

  if (error) {
    return [];
  }

  return data;
}