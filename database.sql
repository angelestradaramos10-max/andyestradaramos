create table if not exists usuarios (
  id bigint generated always as identity primary key,
  usuario text not null unique,
  clave text not null,
  nombre text not null,
  rol text not null default 'admin',
  creado_en timestamp with time zone default now()
);

create table if not exists cursos (
  id bigint generated always as identity primary key,
  nombre text not null unique,
  descripcion text,
  creado_en timestamp with time zone default now()
);

create table if not exists actividades (
  id bigint generated always as identity primary key,
  curso_id bigint not null references cursos(id) on delete cascade,
  unidad int not null,
  semana int not null,
  titulo text not null,
  descripcion text not null,
  fecha date not null default current_date,
  enlace text,
  creado_en timestamp with time zone default now()
);

create table if not exists archivos (
  id bigint generated always as identity primary key,
  actividad_id bigint not null references actividades(id) on delete cascade,
  nombre_archivo text not null,
  tipo_archivo text,
  url_archivo text not null,
  ruta_storage text,
  subido_en timestamp with time zone default now()
);

create table if not exists enlaces (
  id bigint generated always as identity primary key,
  actividad_id bigint not null references actividades(id) on delete cascade,
  titulo text not null,
  url text not null,
  creado_en timestamp with time zone default now()
);

insert into usuarios (usuario, clave, nombre, rol)
values
('andy', '12345', 'Estrada Ramos Andy', 'admin'),
('admin', '12345', 'Estrada Ramos Andy', 'admin')
on conflict (usuario) do nothing;

insert into cursos (nombre, descripcion)
values
('Algoritmos', 'Curso orientado al desarrollo de lógica, estructuras y solución de problemas.'),
('Aplicaciones', 'Curso orientado al desarrollo de interfaces, aplicaciones web y evidencias digitales.')
on conflict (nombre) do nothing;

alter table usuarios enable row level security;
alter table cursos enable row level security;
alter table actividades enable row level security;
alter table archivos enable row level security;
alter table enlaces enable row level security;

drop policy if exists "permitir todo usuarios" on usuarios;
drop policy if exists "permitir todo cursos" on cursos;
drop policy if exists "permitir todo actividades" on actividades;
drop policy if exists "permitir todo archivos" on archivos;
drop policy if exists "permitir todo enlaces" on enlaces;

create policy "permitir todo usuarios" on usuarios
for all using (true) with check (true);

create policy "permitir todo cursos" on cursos
for all using (true) with check (true);

create policy "permitir todo actividades" on actividades
for all using (true) with check (true);

create policy "permitir todo archivos" on archivos
for all using (true) with check (true);

create policy "permitir todo enlaces" on enlaces
for all using (true) with check (true);
