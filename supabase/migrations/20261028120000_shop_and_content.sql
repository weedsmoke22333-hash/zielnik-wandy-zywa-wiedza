-- Wanda Machocka — shop, orders, admin roles and compliance-enforced content.
-- Apply with the Supabase CLI (`supabase db push`) or paste into the SQL editor.

create extension if not exists pgcrypto with schema extensions;

-- ───────────────────────── Roles (admin) ─────────────────────────
create type public.app_role as enum ('admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

-- SECURITY DEFINER avoids recursive RLS when policies need to check roles.
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "users read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

-- ───────────────────────── Products ─────────────────────────
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{3,80}$'),
  title text not null,
  description text not null default '',
  price_grosze integer not null check (price_grosze between 100 and 100000),
  status text not null default 'draft' check (status in ('draft', 'published')),
  pdf_path text,          -- path inside the PRIVATE `ebooks` bucket; never exposed publicly
  cover_path text,        -- path inside the public `covers` bucket
  includes text[],        -- bundles: slugs of included e-books
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- a single e-book cannot be published without its file
  constraint published_needs_file check (status <> 'published' or pdf_path is not null or includes is not null)
);
alter table public.products enable row level security;
create policy "anyone reads published products" on public.products for select using (status = 'published');
create policy "admins manage products" on public.products for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Hide the private file path from browser clients even for published rows
-- (a column-level revoke does not override a table-level grant, so re-grant explicit columns).
-- The admin panel reads pdf_path through server routes using the service role.
revoke select on public.products from anon, authenticated;
grant select (id, slug, title, description, price_grosze, status, cover_path, includes, sort_order, created_at, updated_at)
  on public.products to anon, authenticated;

-- ───────────────────────── Orders ─────────────────────────
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id),
  product_slug text not null,
  product_title text not null,
  amount_grosze integer not null,
  currency text not null default 'pln',
  email text,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'expired', 'refunded')),
  stripe_session_id text unique,
  stripe_payment_intent text,
  download_token text not null default encode(extensions.gen_random_bytes(24), 'hex'),
  download_count integer not null default 0,
  digital_consent_at timestamptz not null,   -- art. 38 pkt 13 ustawy o prawach konsumenta
  terms_accepted_at timestamptz not null,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);
create index orders_created_at_idx on public.orders (created_at desc);
alter table public.orders enable row level security;
-- No policies for anon/authenticated: orders are only reachable through server routes
-- (service role) after verification. Admins read them via /api/admin/orders.
create policy "admins read orders" on public.orders for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Webhook idempotency: one row per processed Stripe event.
create table public.stripe_events (
  id text primary key,
  type text not null,
  received_at timestamptz not null default now()
);
alter table public.stripe_events enable row level security;

-- ───────────────────────── Content (herbs, articles) ─────────────────────────
-- The publish constraints encode the editorial policy: no herb or article goes live without
-- precautions and verifiable sources.
create table public.herbs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  latin text not null,
  polish text not null,
  family text not null,
  evidence text not null check (evidence in ('tradycyjne', 'dobrze-udokumentowane', 'kulinarna')),
  traditional_use text not null,
  contraindications text[] not null default '{}',
  interactions text not null default '',
  harvest jsonb not null default '[]',
  sources jsonb not null default '[]',
  lookalike text,
  legal_note text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  updated_at timestamptz not null default now(),
  constraint herb_publish_rules check (
    status <> 'published' or (
      cardinality(contraindications) > 0
      and jsonb_array_length(sources) > 0
      and length(interactions) > 20
      and jsonb_array_length(harvest) > 0
    )
  )
);
alter table public.herbs enable row level security;
create policy "anyone reads published herbs" on public.herbs for select using (status = 'published');
create policy "admins manage herbs" on public.herbs for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  excerpt text not null,
  body jsonb not null default '[]',          -- [{heading, paragraphs[]}]
  precautions text[] not null default '{}',
  sources jsonb not null default '[]',
  related_herbs text[] not null default '{}',
  related_product text,
  reviewed_by_author boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  updated_at timestamptz not null default now(),
  constraint article_publish_rules check (
    status <> 'published' or (
      cardinality(precautions) > 0
      and jsonb_array_length(sources) > 0
      and reviewed_by_author
    )
  )
);
alter table public.articles enable row level security;
create policy "anyone reads published articles" on public.articles for select using (status = 'published');
create policy "admins manage articles" on public.articles for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- updated_at maintenance
create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
create trigger products_touch before update on public.products for each row execute function public.touch_updated_at();
create trigger herbs_touch before update on public.herbs for each row execute function public.touch_updated_at();
create trigger articles_touch before update on public.articles for each row execute function public.touch_updated_at();

-- ───────────────────────── Storage ─────────────────────────
insert into storage.buckets (id, name, public) values ('ebooks', 'ebooks', false) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('covers', 'covers', true) on conflict (id) do nothing;
-- `ebooks` has NO public policies: files are reachable only via signed URLs created server-side
-- after a paid order is verified. Admin uploads use signed upload URLs from /api/admin/upload-url.
create policy "public reads covers" on storage.objects for select using (bucket_id = 'covers');

-- ───────────────────────── Seed: draft catalogue ─────────────────────────
insert into public.products (slug, title, description, price_grosze, status, includes, sort_order) values
  ('ziola-w-codziennym-zyciu', 'Zioła w codziennym życiu', 'Przewodnik po kilkunastu popularnych roślinach.', 3900, 'draft', null, 1),
  ('codzienne-nawyki-wspierajace-odpornosc', 'Codzienne nawyki wspierające odporność', 'Sen, ruch, odżywianie i odpoczynek — bez obietnic cudów.', 2900, 'draft', null, 2),
  ('domowy-zielnik-dla-poczatkujacych', 'Domowy zielnik dla początkujących', 'Uprawa, zbiór i suszenie ziół krok po kroku.', 4900, 'draft', null, 3),
  ('zielnik-kompletny', 'Zielnik kompletny — pakiet trzech poradników', 'Wszystkie trzy e-booki w pakiecie.', 9900, 'draft',
    array['ziola-w-codziennym-zyciu', 'codzienne-nawyki-wspierajace-odpornosc', 'domowy-zielnik-dla-poczatkujacych'], 4)
on conflict (slug) do nothing;

-- After creating Wanda's account in Supabase Auth, grant admin (replace the e-mail):
-- insert into public.user_roles (user_id, role) select id, 'admin' from auth.users where email = 'WANDA@EXAMPLE.PL';
