-- La librairie des auteurs — schéma de base
-- À exécuter une fois dans l'éditeur SQL du projet Supabase (SQL Editor > New query).
--
-- Principe de sécurité : tout le monde peut LIRE le catalogue (auteurs, livres,
-- dédicaces, annonces). Toutes les ÉCRITURES passent par les Server Actions de
-- l'application, qui vérifient les droits (auteur propriétaire ou superadmin)
-- puis écrivent avec la clé service_role. Aucune écriture directe n'est donc
-- autorisée depuis le navigateur, sauf l'abonnement aux notifications push.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.authors (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  tagline text,
  bio text,
  photo_url text,
  is_local boolean not null default false,
  website text,
  instagram text,
  facebook text,
  created_at timestamptz not null default now()
);

-- profiles : relie un compte de connexion (auth.users) à une fiche auteur.
-- Un auteur peut ne pas avoir de compte (fiche gérée par la librairie seule).
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  author_id uuid not null unique references public.authors (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.authors (id) on delete cascade,
  slug text unique not null,
  title text not null,
  summary text,
  genre text,
  publisher text,
  isbn text,
  release_date date,
  price numeric(10, 2),
  cover_url text,
  is_available boolean not null default true,
  is_signed boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists books_author_id_idx on public.books (author_id);
create index if not exists books_created_at_idx on public.books (created_at desc);

-- signings : séances de dédicace prévues à la librairie (ou ailleurs).
create table if not exists public.signings (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.authors (id) on delete cascade,
  book_id uuid references public.books (id) on delete set null,
  title text,
  description text,
  location text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists signings_starts_at_idx on public.signings (starts_at);
create index if not exists signings_author_id_idx on public.signings (author_id);

-- announcements : annonces publiées par un auteur (author_id renseigné)
-- ou par la librairie elle-même (author_id = null, créées par le superadmin).
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.authors (id) on delete cascade,
  title text not null,
  description text,
  image_url text,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists announcements_author_id_idx on public.announcements (author_id);

-- push_subscriptions : abonnements aux notifications push des visiteurs
-- (anonymes, pas de compte). L'envoi se fait côté serveur via service_role.
create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.authors enable row level security;
alter table public.profiles enable row level security;
alter table public.books enable row level security;
alter table public.signings enable row level security;
alter table public.announcements enable row level security;
alter table public.push_subscriptions enable row level security;

create policy "authors_public_read" on public.authors
  for select using (true);

create policy "books_public_read" on public.books
  for select using (true);

create policy "signings_public_read" on public.signings
  for select using (true);

create policy "announcements_public_read" on public.announcements
  for select using (true);

-- profiles : chaque compte ne voit que sa propre ligne
create policy "profiles_owner_read" on public.profiles
  for select using (id = auth.uid());

-- push_subscriptions : n'importe quel visiteur peut s'abonner ou se
-- désabonner ; personne ne peut lire la liste sauf via service_role.
create policy "push_subscriptions_insert" on public.push_subscriptions
  for insert to anon, authenticated with check (true);

create policy "push_subscriptions_delete" on public.push_subscriptions
  for delete to anon, authenticated using (true);

grant select, insert, delete on public.push_subscriptions to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Storage : bucket public "images", un sous-dossier par auteur (slug) et un
-- dossier "librairie" pour les annonces générales. Les envois passent par des
-- URLs signées générées côté serveur après vérification des droits.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

create policy "images_public_read" on storage.objects
  for select using (bucket_id = 'images');
