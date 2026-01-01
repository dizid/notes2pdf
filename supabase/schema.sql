-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.history (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  template text,
  published_url text,
  thumbnail_url text,
  content_title text,
  content_text text,
  content_style text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT history_pkey PRIMARY KEY (id),
  CONSTRAINT history_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.usage (
  user_id uuid NOT NULL,
  shares_this_month integer DEFAULT 0,
  month_year text,
  is_pro boolean DEFAULT false,
  stripe_customer_id text,
  subscription_id text,
  CONSTRAINT usage_pkey PRIMARY KEY (user_id),
  CONSTRAINT usage_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);