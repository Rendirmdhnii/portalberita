-- Table definition for tracking raw visitor logs from Vercel Edge
create table if not exists public.sys_visitor_logs (
    id uuid default gen_random_uuid() primary key,
    ip_address text,
    city text,
    region text,
    country text,
    user_agent text,
    visited_url text,
    is_suspicious boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Migration query to add column to existing tables:
-- alter table public.sys_visitor_logs add column if not exists is_suspicious boolean default false not null;

-- Enable RLS for database security
alter table public.sys_visitor_logs enable row level security;

-- Drop existing policy if any
drop policy if exists "Allow inserts for all" on public.sys_visitor_logs;

-- Allow inserts from any source (the API route will secure requests using a shared secret key)
create policy "Allow inserts for all" on public.sys_visitor_logs
    for insert with check (true);

-- Indexes for optimal analytics querying
create index if not exists idx_sys_visitor_logs_created_at on public.sys_visitor_logs (created_at desc);
create index if not exists idx_sys_visitor_logs_ip_address on public.sys_visitor_logs (ip_address);
