CREATE TABLE public.journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL,
  scripture text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.journal_entries TO authenticated;
GRANT ALL ON public.journal_entries TO service_role;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own journal entries" ON public.journal_entries FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER touch_journal_entries BEFORE UPDATE ON public.journal_entries FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.user_memories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  memory_date date,
  story text,
  location text,
  people text[] NOT NULL DEFAULT '{}',
  media_paths text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_memories TO authenticated;
GRANT ALL ON public.user_memories TO service_role;
ALTER TABLE public.user_memories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own memories" ON public.user_memories FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER touch_user_memories BEFORE UPDATE ON public.user_memories FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.gratitude_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL,
  category text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gratitude_entries TO authenticated;
GRANT ALL ON public.gratitude_entries TO service_role;
ALTER TABLE public.gratitude_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own gratitude entries" ON public.gratitude_entries FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER touch_gratitude_entries BEFORE UPDATE ON public.gratitude_entries FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

ALTER TABLE public.user_prayers ADD COLUMN IF NOT EXISTS waiting boolean NOT NULL DEFAULT false;