import { redirect } from "next/navigation";

export default function DashboardRoot() {
  // Automatically send user to the rewards page
  redirect("/dashboard/earn-rewards");
}