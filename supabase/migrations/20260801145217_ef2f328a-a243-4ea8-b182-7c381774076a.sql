CREATE POLICY "own memory media read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'memories' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "own memory media insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'memories' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "own memory media update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'memories' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "own memory media delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'memories' AND auth.uid()::text = (storage.foldername(name))[1]);