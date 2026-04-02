-- ─── PROFILES ───────────────────────────────────────────────────────────────
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  display_name text,
  bio text,
  avatar_url text,
  banner_url text,
  banner_color text default 'from-violet-500 to-purple-600',
  role text not null default 'buyer' check (role in ('creator', 'buyer', 'both')),
  currently_building text,
  website text,
  twitter text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── APPS ────────────────────────────────────────────────────────────────────
create table public.apps (
  id uuid default gen_random_uuid() primary key,
  seller_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  tagline text not null,
  description text,
  category text not null,
  tags text[] default '{}',
  price_basic integer not null, -- in cents (USD)
  price_custom integer,
  deposit integer not null,     -- in cents
  pwa_demo_url text,
  demo_url text,
  rating numeric(3,2) default 5.0,
  sold integer default 0,
  status text default 'active' check (status in ('active', 'draft', 'paused')),
  created_at timestamptz default now()
);

alter table public.apps enable row level security;

create policy "Active apps are viewable by everyone"
  on public.apps for select using (status = 'active' or auth.uid() = seller_id);

create policy "Creators can insert apps"
  on public.apps for insert with check (auth.uid() = seller_id);

create policy "Creators can update their apps"
  on public.apps for update using (auth.uid() = seller_id);

-- ─── ORDERS ──────────────────────────────────────────────────────────────────
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  app_id uuid references public.apps(id) not null,
  buyer_id uuid references public.profiles(id) not null,
  seller_id uuid references public.profiles(id) not null,
  plan text not null check (plan in ('basic', 'custom')),
  total_price integer not null,   -- cents
  deposit_paid integer not null,  -- cents
  tail_payment integer not null,  -- cents
  status text default 'deposit_paid' check (status in ('deposit_paid', 'in_progress', 'completed', 'refunded')),
  payment_intent_id text,
  custom_note text,
  created_at timestamptz default now()
);

alter table public.orders enable row level security;

create policy "Buyers and sellers can view their orders"
  on public.orders for select using (auth.uid() = buyer_id or auth.uid() = seller_id);

create policy "Buyers can insert orders"
  on public.orders for insert with check (auth.uid() = buyer_id);

create policy "Sellers can update order status"
  on public.orders for update using (auth.uid() = seller_id or auth.uid() = buyer_id);

-- ─── REVIEWS ─────────────────────────────────────────────────────────────────
create table public.reviews (
  id uuid default gen_random_uuid() primary key,
  app_id uuid references public.apps(id) on delete cascade not null,
  order_id uuid references public.orders(id) not null,
  reviewer_id uuid references public.profiles(id) not null,
  seller_id uuid references public.profiles(id) not null,
  rating integer not null check (rating between 1 and 5),
  body text not null,
  created_at timestamptz default now(),
  unique(order_id) -- one review per order
);

alter table public.reviews enable row level security;

create policy "Reviews are viewable by everyone"
  on public.reviews for select using (true);

create policy "Buyers can insert reviews for their orders"
  on public.reviews for insert with check (auth.uid() = reviewer_id);

-- ─── BOUNTIES ────────────────────────────────────────────────────────────────
create table public.bounties (
  id uuid default gen_random_uuid() primary key,
  poster_id uuid references public.profiles(id) not null,
  title text not null,
  description text not null,
  budget integer not null, -- cents
  category text not null,
  status text default 'open' check (status in ('open', 'claimed', 'completed')),
  created_at timestamptz default now()
);

alter table public.bounties enable row level security;

create policy "Open bounties are viewable by everyone"
  on public.bounties for select using (true);

create policy "Users can insert bounties"
  on public.bounties for insert with check (auth.uid() = poster_id);

create policy "Posters can update their bounties"
  on public.bounties for update using (auth.uid() = poster_id);
