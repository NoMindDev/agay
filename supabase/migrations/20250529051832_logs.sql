-- drop policy "Allow all" on "public"."audit_logs";

-- revoke delete on table "public"."audit_logs" from "anon";

-- revoke insert on table "public"."audit_logs" from "anon";

-- revoke references on table "public"."audit_logs" from "anon";

-- revoke select on table "public"."audit_logs" from "anon";

-- revoke trigger on table "public"."audit_logs" from "anon";

-- revoke truncate on table "public"."audit_logs" from "anon";

-- revoke update on table "public"."audit_logs" from "anon";

-- revoke delete on table "public"."audit_logs" from "authenticated";

-- revoke insert on table "public"."audit_logs" from "authenticated";

-- revoke references on table "public"."audit_logs" from "authenticated";

-- revoke select on table "public"."audit_logs" from "authenticated";

-- revoke trigger on table "public"."audit_logs" from "authenticated";

-- revoke truncate on table "public"."audit_logs" from "authenticated";

-- revoke update on table "public"."audit_logs" from "authenticated";

-- revoke delete on table "public"."audit_logs" from "service_role";

-- revoke insert on table "public"."audit_logs" from "service_role";

-- revoke references on table "public"."audit_logs" from "service_role";

-- revoke select on table "public"."audit_logs" from "service_role";

-- revoke trigger on table "public"."audit_logs" from "service_role";

-- revoke truncate on table "public"."audit_logs" from "service_role";

-- revoke update on table "public"."audit_logs" from "service_role";

-- revoke delete on table "public"."conversations" from "anon";

-- revoke insert on table "public"."conversations" from "anon";

-- revoke references on table "public"."conversations" from "anon";

-- revoke select on table "public"."conversations" from "anon";

-- revoke trigger on table "public"."conversations" from "anon";

-- revoke truncate on table "public"."conversations" from "anon";

-- revoke update on table "public"."conversations" from "anon";

-- revoke delete on table "public"."conversations" from "authenticated";

-- revoke insert on table "public"."conversations" from "authenticated";

-- revoke references on table "public"."conversations" from "authenticated";

-- revoke select on table "public"."conversations" from "authenticated";

-- revoke trigger on table "public"."conversations" from "authenticated";

-- revoke truncate on table "public"."conversations" from "authenticated";

-- revoke update on table "public"."conversations" from "authenticated";

-- revoke delete on table "public"."conversations" from "service_role";

-- revoke insert on table "public"."conversations" from "service_role";

-- revoke references on table "public"."conversations" from "service_role";

-- revoke select on table "public"."conversations" from "service_role";

-- revoke trigger on table "public"."conversations" from "service_role";

-- revoke truncate on table "public"."conversations" from "service_role";

-- revoke update on table "public"."conversations" from "service_role";

-- revoke delete on table "public"."member" from "anon";

-- revoke insert on table "public"."member" from "anon";

-- revoke references on table "public"."member" from "anon";

-- revoke select on table "public"."member" from "anon";

-- revoke trigger on table "public"."member" from "anon";

-- revoke truncate on table "public"."member" from "anon";

-- revoke update on table "public"."member" from "anon";

-- revoke delete on table "public"."member" from "authenticated";

-- revoke insert on table "public"."member" from "authenticated";

-- revoke references on table "public"."member" from "authenticated";

-- revoke select on table "public"."member" from "authenticated";

-- revoke trigger on table "public"."member" from "authenticated";

-- revoke truncate on table "public"."member" from "authenticated";

-- revoke update on table "public"."member" from "authenticated";

-- revoke delete on table "public"."member" from "service_role";

-- revoke insert on table "public"."member" from "service_role";

-- revoke references on table "public"."member" from "service_role";

-- revoke select on table "public"."member" from "service_role";

-- revoke trigger on table "public"."member" from "service_role";

-- revoke truncate on table "public"."member" from "service_role";

-- revoke update on table "public"."member" from "service_role";

-- revoke delete on table "public"."messages" from "anon";

-- revoke insert on table "public"."messages" from "anon";

-- revoke references on table "public"."messages" from "anon";

-- revoke select on table "public"."messages" from "anon";

-- revoke trigger on table "public"."messages" from "anon";

-- revoke truncate on table "public"."messages" from "anon";

-- revoke update on table "public"."messages" from "anon";

-- revoke delete on table "public"."messages" from "authenticated";

-- revoke insert on table "public"."messages" from "authenticated";

-- revoke references on table "public"."messages" from "authenticated";

-- revoke select on table "public"."messages" from "authenticated";

-- revoke trigger on table "public"."messages" from "authenticated";

-- revoke truncate on table "public"."messages" from "authenticated";

-- revoke update on table "public"."messages" from "authenticated";

-- revoke delete on table "public"."messages" from "service_role";

-- revoke insert on table "public"."messages" from "service_role";

-- revoke references on table "public"."messages" from "service_role";

-- revoke select on table "public"."messages" from "service_role";

-- revoke trigger on table "public"."messages" from "service_role";

-- revoke truncate on table "public"."messages" from "service_role";

-- revoke update on table "public"."messages" from "service_role";

-- revoke delete on table "public"."permission" from "anon";

-- revoke insert on table "public"."permission" from "anon";

-- revoke references on table "public"."permission" from "anon";

-- revoke select on table "public"."permission" from "anon";

-- revoke trigger on table "public"."permission" from "anon";

-- revoke truncate on table "public"."permission" from "anon";

-- revoke update on table "public"."permission" from "anon";

-- revoke delete on table "public"."permission" from "authenticated";

-- revoke insert on table "public"."permission" from "authenticated";

-- revoke references on table "public"."permission" from "authenticated";

-- revoke select on table "public"."permission" from "authenticated";

-- revoke trigger on table "public"."permission" from "authenticated";

-- revoke truncate on table "public"."permission" from "authenticated";

-- revoke update on table "public"."permission" from "authenticated";

-- revoke delete on table "public"."permission" from "service_role";

-- revoke insert on table "public"."permission" from "service_role";

-- revoke references on table "public"."permission" from "service_role";

-- revoke select on table "public"."permission" from "service_role";

-- revoke trigger on table "public"."permission" from "service_role";

-- revoke truncate on table "public"."permission" from "service_role";

-- revoke update on table "public"."permission" from "service_role";

-- alter table "public"."conversations" drop constraint "conversations_created_by_fkey";

-- alter table "public"."messages" drop constraint "messages_conversation_id_fkey";

-- alter table "public"."permission" drop constraint "permission_member_id_fkey";

-- alter table "public"."audit_logs" drop constraint "audit_logs_pkey";

-- alter table "public"."conversations" drop constraint "conversations_pkey";

-- alter table "public"."member" drop constraint "member_pkey";

-- alter table "public"."messages" drop constraint "messages_pkey";

-- alter table "public"."permission" drop constraint "permission_pkey";

-- drop index if exists "public"."audit_logs_pkey";

-- drop index if exists "public"."conversations_pkey";

-- drop index if exists "public"."member_pkey";

-- drop index if exists "public"."messages_pkey";

-- drop index if exists "public"."permission_pkey";

-- drop table "public"."audit_logs";

-- drop table "public"."conversations";

-- drop table "public"."member";

-- drop table "public"."messages";

-- drop table "public"."permission";

-- create table "public"."logs" (
--     "id" uuid not null default gen_random_uuid(),
--     "date" timestamp with time zone default now(),
--     "user_name" text,
--     "user_email" text,
--     "event" text,
--     "description" text,
--     "resource_name" text,
--     "resource_link" text
-- );

create table if not exists public.logs (
    "id" uuid not null default gen_random_uuid(),
    "date" timestamp with time zone default now(),
    "user_name" text,
    "user_email" text,
    "event" text,
    "description" text,
    "resource_name" text,
    "resource_link" text
);

-- drop type "public"."member_roles";

-- drop type "public"."member_status";

-- drop type "public"."sender_type";

-- CREATE UNIQUE INDEX logs_pkey ON public.logs USING btree (id);

-- alter table "public"."logs" add constraint "logs_pkey" PRIMARY KEY using index "logs_pkey";

-- grant delete on table "public"."logs" to "anon";

-- grant insert on table "public"."logs" to "anon";

-- grant references on table "public"."logs" to "anon";

-- grant select on table "public"."logs" to "anon";

-- grant trigger on table "public"."logs" to "anon";

-- grant truncate on table "public"."logs" to "anon";

-- grant update on table "public"."logs" to "anon";

-- grant delete on table "public"."logs" to "authenticated";

-- grant insert on table "public"."logs" to "authenticated";

-- grant references on table "public"."logs" to "authenticated";

-- grant select on table "public"."logs" to "authenticated";

-- grant trigger on table "public"."logs" to "authenticated";

-- grant truncate on table "public"."logs" to "authenticated";

-- grant update on table "public"."logs" to "authenticated";

-- grant delete on table "public"."logs" to "service_role";

-- grant insert on table "public"."logs" to "service_role";

-- grant references on table "public"."logs" to "service_role";

-- grant select on table "public"."logs" to "service_role";

-- grant trigger on table "public"."logs" to "service_role";

-- grant truncate on table "public"."logs" to "service_role";

-- grant update on table "public"."logs" to "service_role";


