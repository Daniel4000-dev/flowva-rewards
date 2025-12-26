"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

import { Notification } from "@/types";

export async function getUserNotifications() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];

  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (data as Notification[]) || [];
}

export async function markAsRead(notificationId: string) {
  const supabase = await createClient();
  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId);
  
  revalidatePath("/", "layout");
}

export async function markAllAsRead() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id);
  }
  revalidatePath("/", "layout");
}

export async function deleteNotification(notificationId: string) {
  const supabase = await createClient();
  await supabase.from("notifications").delete().eq("id", notificationId);
  revalidatePath("/", "layout");
}

export async function deleteAllNotifications() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    await supabase.from("notifications").delete().eq("user_id", user.id);
  }
  revalidatePath("/", "layout");
}