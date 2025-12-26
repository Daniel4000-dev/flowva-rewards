# Rewards Dashboard Implementation

A full-stack implementation of the Rewards page feature for the Flowva Hub platform.
This project strictly follows the requirement to use **Supabase** for all backend logic (Auth, Database, Storage).

**Live URL:** [https://flowva-rewards-sigma.vercel.app](https://flowva-rewards-sigma.vercel.app)

---

## Tech Stack

-   **Frontend:** React 18 (Next.js 16 App Router), TypeScript, TailwindCSS, Shadcn UI
-   **Backend:** Supabase (PostgreSQL, Authentication, Storage, Edge Functions)
-   **State Management:** React Server Components (RSC) + Server Actions + Optimistic UI
-   **Deployment:** Vercel

## Architecture & Design Decisions

### 1. Hybrid Rendering (RSC + Client Components)
-   **Data Fetching:** All initial data (points balance, streak, user profile) is fetched server side in `page.tsx`. This ensures fast First Contentful Paint (FCP) and secure data access without exposing API keys.
-   **Interactivity:** Client components (`GoogleAuthButton`, `EarnTabContent`) handle user interactions.
-   **Optimistic UI:** When a user claims a streak or reward, the UI updates *instantly* via local state while the Server Action processes the request in the background. If the request fails, the UI reverts.

### 2. Supabase Integration
-   **Authentication:** 
    -   Uses Supabase Auth with Google OAuth for secure sign-in.
    -   Middleware protects private routes (`/dashboard`) and handles session refreshing.
-   **Database:** 
    -   Row Level Security (RLS) policies are enforced to ensure users can only access their own data.
    -   `profiles` table acts as a public extension of the `auth.users` table to store custom fields like `points_balance` and `current_streak`.
-   **Storage:** 
    -   "Reclaim Proof" screenshots are uploaded to a private Supabase Storage bucket (`proofs`) accessible only by the uploader and admins.

### 3. Clean Code & Maintainability
-   **Type Safety:** Fully typed with TypeScript interfaces matching the Database Schema.
-   **Modularity:** Features are split into small, single-responsibility components (e.g., `DailyStreakCard`, `SpotlightCard`).
-   **Server Actions:** No API routes were used; all mutations happen via Next.js Server Actions for type safety and reduced boilerplate.

## Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Daniel4000-dev/flowva-rewards
    cd flowva-rewards
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env.local` file in the root directory:
    ```bash
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    NEXT_PUBLIC_SITE_URL=http://localhost:3000
    ```

4.  **Database Setup:**
    -   Run the SQL script provided in `schema.sql` (if included) or manually create the `profiles`, `rewards`, and `claim_requests` tables in Supabase.
    -   Enable Google Auth Provider in Supabase.

5.  **Run Locally:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000)

## 🤔 Assumptions & Trade-offs

-   **Spotlight Bonus:** I assumed the "Claim" button for the Spotlight feature should instantly consistently award points for this demo, triggering an optimized RPC call (`increment_points`) for concurrency safety.
-   **Stacks Feature:** Since I did not have access to the real "Stack" infrastructure, I hardcoded the `checkStackStatus` to return `false` to demonstrate the "Empty State" modal as requested in the web design.
-   **Streak Logic:** The daily streak logic allows for a 48-hour window (grace period) to keep the streak alive if a user misses one day, which is a common gamification pattern to prevent user churn.

---