# Flowva Rewards Hub Re-implementation

This project is a pixel-perfect recreation of the Flowva Rewards page, built as a technical assessment for the React Full-Stack Developer role. It leverages **Next.js 15**, **React 19**, **Tailwind CSS**, and **Supabase**.

## 🚀 Tech Stack

-   **Frontend**: Next.js (App Router), React, Tailwind CSS, Lucide Icons.
-   **UI Library**: Shadcn UI (Radix Primitives).
-   **Backend**: Supabase (PostgreSQL, Auth, Edge Functions).
-   **State Management**: React Server Components + Client Hooks.

## 🛠️ Setup Instructions

1.  **Prerequisites**:
    -   Node.js >= 20.9.0
    -   npm or yarn

2.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd flowva-rewards
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Variables**:
    Create a `.env.local` file in the root directory and add your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Database Setup**:
    -   Go to your Supabase Dashboard.
    -   Open the SQL Editor.
    -   Copy and paste the contents of `schema.sql` (found in the root of this project) to initialize the database tables, triggers, and sample data.

5.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🏗️ Architectural Decisions

-   **Server Components First**: Leveraging Next.js App Router to fetch data on the server (`src/app/dashboard/rewards/page.tsx`) for improved performance and SEO.
-   **Skeleton Loading Strategy**: Implemented custom Skeleton components (`RewardCardSkeleton`, `StatsCardSkeleton`) that perfectly mirror the final UI to minimize Cumulative Layout Shift (CLS).
-   **Premium Loading Experience**: A custom `LoadingSequencer` manages the initial "App Launch" experience (Animated Icon -> Skeleton -> Data) to provide a polished feel, ensuring users on fast networks still experience the branding sequence.
-   **Supabase Integration**:
    -   **Auth**: Handled via `src/actions/auth.ts` using Server Actions for secure, JS-free form submissions where possible.
    -   **Database**: Typed query results using TypeScript interfaces matching the schema.

## ✨ Key Features

-   **Dynamic Rewards Grid**: Renders rewards based on Supabase data.
-   **Real-time Notifications**: (Mocked logic in `handle_new_user`) Triggers welcome notifications on signup.
-   **Interactive Sidebar**: User menu with "Log Out" functionality.
-   **Responsive Design**: Fully responsive layout matching the provided screenshots.

## 🕵️ Trade-offs

-   **Mocked "Streak" Logic**: The daily streak is currently calculated based on a simple integer column. A production version would likely use a robust `activity_log` table.
-   **Client-Side "Sequencer"**: To guarantee the specific "Icon -> Skeleton" animation sequence demanded by the prompt, we use a Client Component wrapper. Ideally, streaming Server Components (`Suspense`) would be used exclusively, but the specific animation requirement necessitated this hybrid approach.