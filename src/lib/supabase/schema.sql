-- 1. Create PROFILES table (Linked to Auth)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  referral_code text unique,
  points_balance integer default 0,
  current_streak integer default 0,
  last_claim_date timestamptz,
  created_at timestamptz default now(),
  referred_by uuid references public.profiles(id) -- Stores who invited this user
);

-- Enable Security
alter table public.profiles enable row level security;

-- Policies
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- -------------------------------------------------------

-- 2. Create NOTIFICATIONS table (NEW SECTION)
create table public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  message text not null,
  type text check (type in ('streak', 'info', 'system', 'reward')) default 'info',
  is_read boolean default false,
  created_at timestamptz default now()
);

-- Enable Security
alter table public.notifications enable row level security;

-- Policies
create policy "Users can view own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Users can update own notifications" on public.notifications for update using (auth.uid() = user_id);
create policy "Users can delete own notifications" on public.notifications for delete using (auth.uid() = user_id);

-- -------------------------------------------------------

-- 3. The "Handle New User" Trigger (Combines Signup, Referrals, AND Notifications)
create or replace function public.handle_new_user()
returns trigger as $$
declare
  referrer_id uuid;
  provided_ref_code text;
begin
  -- A. Check for Referral Code
  provided_ref_code := new.raw_user_meta_data->>'referral_code';

  if provided_ref_code is not null then
    select id into referrer_id from public.profiles where referral_code = provided_ref_code;
  end if;

  -- B. Create the User Profile
  insert into public.profiles (id, email, full_name, referral_code, referred_by)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name',
    'ref_' || substr(md5(random()::text), 1, 6),
    referrer_id
  );

  -- C. Handle Referral Rewards (Points + Notification for Referrer)
  if referrer_id is not null then
    -- Give 25 Points to the Referrer
    update public.profiles
    set points_balance = points_balance + 25
    where id = referrer_id;
    
    -- Notify the Referrer
    insert into public.notifications (user_id, title, message, type)
    values (referrer_id, 'Referral Bonus!', 'You earned 25 points for referring a friend.', 'reward');
  end if;

  -- D. Send Welcome Notification to the NEW USER
  insert into public.notifications (user_id, title, message, type)
  values (
    new.id, 
    'Welcome to Flowva!', 
    'We''re thrilled to have you on board! Explore powerful tools, build your personal stack, and start unlocking rewards.', 
    'info'
  );

  return new;
end;
$$ language plpgsql security definer;

-- Attach the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- -------------------------------------------------------

-- 4. Create REWARDS table
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

-- -------------------------------------------------------

-- 5. Create CLAIMS table
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

-- -------------------------------------------------------

-- 6. INSERT DEFAULT REWARDS DATA
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