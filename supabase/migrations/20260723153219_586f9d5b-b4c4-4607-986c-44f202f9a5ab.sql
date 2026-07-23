
CREATE TABLE public.shamar_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'A new chapter',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shamar_threads TO authenticated;
GRANT ALL ON public.shamar_threads TO service_role;
ALTER TABLE public.shamar_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own threads" ON public.shamar_threads FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX shamar_threads_user_idx ON public.shamar_threads(user_id, updated_at DESC);

CREATE TABLE public.shamar_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES public.shamar_threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user','assistant','system')),
  parts JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shamar_messages TO authenticated;
GRANT ALL ON public.shamar_messages TO service_role;
ALTER TABLE public.shamar_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own messages" ON public.shamar_messages FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX shamar_messages_thread_idx ON public.shamar_messages(thread_id, created_at ASC);
