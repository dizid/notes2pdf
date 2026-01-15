-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.brand_kits (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL DEFAULT 'My Brand'::text,
  colors jsonb DEFAULT '[]'::jsonb,
  fonts jsonb DEFAULT '{}'::jsonb,
  mood jsonb DEFAULT '{}'::jsonb,
  source_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT brand_kits_pkey PRIMARY KEY (id),
  CONSTRAINT brand_kits_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
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
  slug text,
  CONSTRAINT history_pkey PRIMARY KEY (id),
  CONSTRAINT history_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.page_stats (
  slug text NOT NULL,
  user_id uuid,
  total_views integer DEFAULT 0,
  last_viewed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT page_stats_pkey PRIMARY KEY (slug)
);
CREATE TABLE public.page_views (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  user_id uuid,
  viewed_at timestamp with time zone DEFAULT now(),
  referrer text,
  country text,
  CONSTRAINT page_views_pkey PRIMARY KEY (id)
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