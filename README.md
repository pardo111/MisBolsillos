
create table transactions (
 id uuid primary key default gen_random_uuid(),
 user_id uuid references auth.users not null,
 merchant text not null,
 amount numeric not null,
 category text not null,
 type text check (type in ('income', 'expense')) not null,
 created_at timestamptz default now()
);
alter table transactions enable row level security;
create policy "own data" on transactions
 using (auth.uid() = user_id)
 with check (auth.uid() = user_id)


 -- Tabla de perfiles, 1 a 1 con auth.users
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name varchar(40),
  phone varchar(12),
  updated_at timestamptz default now()
);

-- Row Level Security: cada usuario solo ve/edita su propio perfil
alter table public.profiles enable row level security;

create policy "Usuarios pueden ver su propio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Usuarios pueden actualizar su propio perfil"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Usuarios pueden insertar su propio perfil"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Trigger: crea el perfil automáticamente cuando alguien se registra
create function public.handle_new_user()
returns trigger
language plpgsql  
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();