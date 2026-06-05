create table if not exists public.users (
  id uuid primary key,
  name text not null,
  email text not null unique,
  phone text,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(12, 2) not null,
  supplier text not null,
  delivery_days integer not null,
  image_url text
);

create table if not exists public.orders (
  id uuid primary key,
  user_id uuid references public.users(id) on delete cascade,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  price numeric(12, 2) not null,
  supplier text not null,
  address text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;

create policy "Users can read own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.users for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

create policy "Products are readable by authenticated users"
  on public.products for select
  using (auth.role() = 'authenticated');

create policy "Users can read own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Users can insert own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);
