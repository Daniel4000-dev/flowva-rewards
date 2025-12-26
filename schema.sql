-- ==========================================
-- STEP 0: CLEANUP (Start Fresh)
-- ==========================================
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop table if exists public.claim_requests;
drop table if exists public.notifications;
drop table if exists public.rewards;
drop table if exists public.profiles;

-- ==========================================
-- STEP 1: Create PROFILES (With Avatar & Referrals)
-- ==========================================
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  referral_code text unique,
  points_balance integer default 0,
  current_streak integer default 0,
  last_claim_date timestamptz,
  avatar_url text, -- Stores Google Profile Picture
  created_at timestamptz default now(),
  referred_by uuid references public.profiles(id)
);

alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- ==========================================
-- STEP 2: Create NOTIFICATIONS
-- ==========================================
create table public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  message text not null,
  type text check (type in ('streak', 'info', 'system', 'reward', 'security')) default 'info',
  is_read boolean default false,
  created_at timestamptz default now()
);

alter table public.notifications enable row level security;
create policy "Users can view own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Users can update own notifications" on public.notifications for update using (auth.uid() = user_id);
create policy "Users can delete own notifications" on public.notifications for delete using (auth.uid() = user_id);

-- ==========================================
-- STEP 3: The Master Trigger (Signup + Avatar + Multiple Notifications)
-- ==========================================
create or replace function public.handle_new_user()
returns trigger as $$
declare
  referrer_id uuid;
  provided_ref_code text;
  user_avatar text;
begin
  -- A. Get Metadata
  provided_ref_code := new.raw_user_meta_data->>'referral_code';
  user_avatar := new.raw_user_meta_data->>'avatar_url';

  if provided_ref_code is not null then
    select id into referrer_id from public.profiles where referral_code = provided_ref_code;
  end if;

  -- B. Create Profile
  insert into public.profiles (id, email, full_name, referral_code, referred_by, avatar_url)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name',
    'ref_' || substr(md5(random()::text), 1, 6),
    referrer_id,
    user_avatar
  );

  -- C. Referral Logic
  if referrer_id is not null then
    update public.profiles set points_balance = points_balance + 25 where id = referrer_id;
    
    insert into public.notifications (user_id, title, message, type)
    values (referrer_id, 'Referral Bonus!', 'You earned 25 points for referring a friend.', 'reward');
  end if;

  -- D. Send 3 WELCOME NOTIFICATIONS (Matching Screenshot Logic)
  
  -- 1. Welcome Message
  insert into public.notifications (user_id, title, message, type)
  values (new.id, 'Welcome to Flowva!', 'We''re thrilled to have you here! Start building your stack.', 'info');

  -- 2. Daily Streak Reminder
  insert into public.notifications (user_id, title, message, type)
  values (new.id, 'Start your streak!', 'Don''t forget to claim your daily points to keep your streak alive.', 'streak');

  -- 3. Security/Account Info
  insert into public.notifications (user_id, title, message, type)
  values (new.id, 'Account Secured', 'Your account was successfully created via ' || coalesce(new.raw_app_meta_data->>'provider', 'email') || '.', 'security');

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==========================================
-- STEP 4: Create REWARDS & CLAIMS
-- ==========================================
create table public.rewards (
  id serial primary key,
  title text not null,
  description text not null,
  cost integer not null,
  type text check (type in ('transfer', 'card', 'gift_card', 'course')),
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.rewards enable row level security;
create policy "Anyone can view active rewards" on public.rewards for select using (true);

create table public.claim_requests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  email_used text,
  screenshot_path text,
  reward_id integer references public.rewards(id),
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz default now()
);

alter table public.claim_requests enable row level security;
create policy "Users can view own claims" on public.claim_requests for select using (auth.uid() = user_id);
create policy "Users can insert claims" on public.claim_requests for insert with check (auth.uid() = user_id);

-- ==========================================
-- STEP 5: INSERT REWARDS DATA
-- ==========================================
insert into public.rewards (title, description, cost, type, is_active)
values
  ('$5 Bank Transfer', 'The $5 equivalent will be transferred to your bank account.', 5000, 'transfer', true),
  ('$5 PayPal International', 'Receive a $5 PayPal balance transfer directly to your PayPal account email.', 5000, 'transfer', true),
  ('$5 Virtual Visa Card', 'Use your $5 prepaid card to shop anywhere Visa is accepted online.', 5000, 'card', true),
  ('$5 Apple Gift Card', 'Redeem this $5 Apple Gift Card for apps, games, music, movies, and more on the App Store and iTunes.', 5000, 'gift_card', true),
  ('$5 Google Play Card', 'Use this $5 Google Play Gift Card to purchase apps, games, movies, books, and more on the Google Play Store.', 5000, 'gift_card', true),
  ('$5 Amazon Gift Card', 'Get a $5 digital gift card to spend on your favorite tools or platforms.', 5000, 'gift_card', true),
  ('$10 Amazon Gift Card', 'Get a $10 digital gift card to spend on your favorite tools or platforms.', 10000, 'gift_card', true),
  ('Free Udemy Course', 'Coming Soon!', 0, 'course', false);
