
CREATE TABLE public.waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('premium', 'tax_watch')),
  pin TEXT,
  lookup_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can join the waitlist"
ON public.waitlist FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE TABLE public.fairness_emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  lookup_id TEXT NOT NULL,
  pin TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.fairness_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a fairness email"
ON public.fairness_emails FOR INSERT
TO anon, authenticated
WITH CHECK (true);
