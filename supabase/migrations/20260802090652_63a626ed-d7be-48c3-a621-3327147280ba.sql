CREATE TABLE public.saved_scriptures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reference text NOT NULL,
  verse_text text NOT NULL,
  translation text NOT NULL DEFAULT 'WEB',
  theme text,
  reflection text,
  favourite boolean NOT NULL DEFAULT true,
  journal_entry_id uuid REFERENCES public.journal_entries(id) ON DELETE SET NULL,
  prayer_id uuid REFERENCES public.user_prayers(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_scriptures TO authenticated;
GRANT ALL ON public.saved_scriptures TO service_role;
ALTER TABLE public.saved_scriptures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own saved scriptures" ON public.saved_scriptures FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER touch_saved_scriptures BEFORE UPDATE ON public.saved_scriptures FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.user_preferences (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  translation text NOT NULL DEFAULT 'WEB',
  daily_scripture_dismissed_on date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_preferences TO authenticated;
GRANT ALL ON public.user_preferences TO service_role;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own preferences" ON public.user_preferences FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER touch_user_preferences BEFORE UPDATE ON public.user_preferences FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.memory_suggestion_dismissals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  suggestion_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, suggestion_key)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.memory_suggestion_dismissals TO authenticated;
GRANT ALL ON public.memory_suggestion_dismissals TO service_role;
ALTER TABLE public.memory_suggestion_dismissals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own suggestion dismissals" ON public.memory_suggestion_dismissals FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.user_letters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text NOT NULL,
  recipient text,
  open_on date,
  visibility text NOT NULL DEFAULT 'private',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_letters TO authenticated;
GRANT ALL ON public.user_letters TO service_role;
ALTER TABLE public.user_letters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own letters" ON public.user_letters FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER touch_user_letters BEFORE UPDATE ON public.user_letters FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

ALTER TABLE public.user_memories
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS visibility text NOT NULL DEFAULT 'private',
  ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}'::text[];

ALTER TABLE public.user_prayers
  ADD COLUMN IF NOT EXISTS answered boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS answered_at timestamptz,
  ADD COLUMN IF NOT EXISTS answer_note text;

CREATE INDEX IF NOT EXISTS user_memories_user_date_idx ON public.user_memories (user_id, memory_date);
CREATE INDEX IF NOT EXISTS saved_scriptures_user_idx ON public.saved_scriptures (user_id, created_at DESC);