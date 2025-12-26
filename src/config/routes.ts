import { NavItem } from "@/types";
import { 
  House, Compass, Library, Layers, 
  CreditCard, Gem, Settings, LogOut, 
  PackageOpen,
  UserRoundCog
} from "lucide-react";

export const APP_ROUTES = {
  SIGNIN: "/signin",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  HOME: "/",
  DISCOVER: "/dashboard/discover",
  LIBRARY: "/dashboard/library",
  TECH_STACK: "/dashboard/tech-stack",
  SUBSCRIPTIONS: "/dashboard/subscriptions",
  REWARDS: "/dashboard/rewards",
  SETTINGS: "/dashboard/settings",
};

export const SIDEBAR_ITEMS: NavItem[] = [
  { title: "Home", url: APP_ROUTES.HOME, icon: House },
  { title: "Discover", url: APP_ROUTES.DISCOVER, icon: Compass },
  { title: "Library", url: APP_ROUTES.LIBRARY, icon: PackageOpen },
  { title: "Tech Stack", url: APP_ROUTES.TECH_STACK, icon: Layers },
  { title: "Subscriptions", url: APP_ROUTES.SUBSCRIPTIONS, icon: CreditCard },
  { title: "Rewards Hub", url: APP_ROUTES.REWARDS, icon: Gem, subText: "Earn points, unlock rewards, and celebrate your progress!" },
  { title: "Settings", url: APP_ROUTES.SETTINGS, icon: UserRoundCog },
];