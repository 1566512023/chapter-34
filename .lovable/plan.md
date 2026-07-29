A large multi-part change. Grouped so you can approve the whole set or trim.

## 1. Bright, girly landing page (no brown, no candles)

- Rework `src/routes/index.tsx` background from radial brown/rose to a bright blush → sky-blue → lavender wash with soft cloud gradient. Remove the "candle" copy and the amber "opening flash" — replace with a soft rose+sky bloom.
- Regenerate the journal cover as a **pink velvet** journal (default) with soft-gold "Phindile · Chapter 34" foil, keeping the ribbon in coral. Also generate an alt **sky-blue** cover.
- Toggle above the journal: "Pink / Blue" — persists in localStorage so revisits remember the pick.
- Recolor the desk atmosphere overlay from warm amber to cool ivory/pearl highlights (`AmbientDesk.tsx`).
- Tweak `--background`, journal breathe drop-shadow, and the "returning" caption color so nothing reads brown.

## 2. Chapter soundscape controls

- Add `src/components/SoundscapePlayer.tsx`: a small pill that lives inside `ChapterFrame` (top-right of the chapter viewport, below the global nav) with Play/Pause, mute, and a slim volume slider.
- Ambient loops are chosen per chapter (birdsong for Garden, choir hum for Sanctuary, page-turn silence for Writing Room, etc.) via a map in `src/lib/soundscapes.ts`. Loops are lightweight CC0 mp3s stored in `public/audio/` — I'll generate them via ElevenLabs SFX (long-form ambient) once the ElevenLabs connector is linked; until then the player renders with an "audio coming soon" state and the mute/volume UI still works.
- Volume, mute, and per-chapter enabled state persisted in localStorage; respected across navigation.

## 3. Add-a-dream / add-a-prayer cards

- New `src/lib/user-content.ts` (Supabase-backed) with tables `user_dreams` and `user_prayers` (RLS by `auth.uid()`), plus server fns to list/create/delete.
- Migration creates both tables with grants + RLS.
- In the Dreams chapter, each empty "✨ __________" slot becomes an "Add a dream" card that opens a journal-styled modal (title, promise/scripture, note). Saved cards render inline in the same handwritten style. Signed-out visitors see a "sign in to add" prompt linking to `/auth`.
- Same pattern for a new Prayer Room add-a-prayer card (Chapter 13).

## 4. "Add a person" for the Garden

- Reuses the same server fn stack: table `user_people` (name, relation, note, bloom_color, chapter_placement).
- The 5 blank "✨ __________" blooms in the Garden become "Add a person" buttons opening a small journal modal. On save the bloom fills with the given name and instantly appears in:
  - Garden That Helped You Bloom (Chapter 3)
  - Legacy Tree (Chapter 15 — new leaf on the tree)
  - Memory Flowers (Chapter 11 — added to a "People who bloomed with me" strip in the 2026 album)
- Delete/edit available from the bloom's reveal modal for the row's owner.

## 5. Reduced-motion toggle

- New `src/lib/motion.ts` (localStorage flag + `matchMedia('(prefers-reduced-motion)')` fallback) and a React context so any component can read `useReducedMotion()`.
- Toggle lives in the `JournalNav` panel ("Gentle motion" switch) so it's reachable from every page.
- When on: disable `journal-breathe`, `ribbon-sway`, `page-turn-*`, `pen-drive`, `dust`, `flicker`, and the opening flash; keep simple fades under 200ms. Applied via a `data-reduced-motion="true"` attribute on `<html>` and matching CSS overrides in `src/styles.css`.

## 6. Sign-up fix for Phindile

- Symptom likely = Supabase auth has "Enable signups" disabled. I'll call `supabase--configure_auth` to enable email signups and keep email confirmations on (Phindile will get a magic confirm link).
- Also polish `/auth`: switch default `mode` to `signup` when the URL is `/auth?new=1`, and surface a clearer error when signups are disabled.

## Technical notes

- No new frameworks. All new tables use RLS `auth.uid() = user_id` with GRANTs for `authenticated` + `service_role` only.
- Soundscape audio files added under `public/audio/` (no build changes).
- Reduced motion is CSS-driven so it doesn't require component rewrites.
- Landing color toggle and reduced-motion respect SSR by reading in `useEffect`.

## Out of scope (ask if you want them)

- Adding ambient audio for Chapters I haven't listed a mood for — I'll pick sensible defaults, but tell me if you want specific sounds per chapter.
- Editing existing seeded dream/prayer/people copy — I'll leave your current entries as-is and only fill the blank slots.
