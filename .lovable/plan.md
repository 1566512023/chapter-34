## Website Revisions Plan

A large multi-part update. I'll group work into cohesive phases so nothing regresses.

### 1. Content & Data (`src/data/chapters.ts`)
- **Garden**: add Granny, Sister, Zane, plus 5 blank "✨ __________" placeholder items rendered as elegant empty slots.
- **Woman You Have Become**: reorder pillars → Faith, Mother, Partner, Sister, Lawyer, Business Owner, Leader.
- **Dreams**: remove "Kingdom Impact"; add blank dream cards (My Next Dream, Another Prayer, A Place I'd Love to Visit, A Future Goal, two blanks).
- **Timeline (Thus Far)**: change 1991 → 1992 anywhere it appears; remove the standalone 2026 "Welcome Home, Pen" milestone (moves to Book of Memories).
- **Book of Memories**: replace existing shelves with chronological yearly albums 2010 → 2028+. 2026 album titled "2026 – Chapter 34" and contains: Welcome Home Pen, Birthday Memories, Family Moments, Journal Entries, Videos, Voice Notes, Answered Prayers, Business Milestones, Photo Gallery.
- **Chapter swap**: swap chapter 6 and 7 so order becomes Little Hands Big Love (6), Called With Purpose (7). Keep existing IDs stable so bookmarks/inventory don't break; only swap `number` labels and array order.

### 2. Chapter Registry (`src/chapters/index.tsx`)
- Garden: render placeholder people as ghosted, dashed-outline blooms.
- Woman: render pillars in new order (data-driven — already reads from data).
- Dreams: render blank cards with subtle "add later" styling.
- Book of Memories: rework the shelf UI into year-labeled albums with sub-items; 2026 highlighted as "Chapter 34".
- Ensure the Pen easter-egg still triggers from the 2026 album's "Welcome Home, Pen" item.

### 3. Navigation
- **Back button**: new persistent `<JournalBackButton>` mounted from `__root.tsx`. Hidden on `/`. Uses `router.history.back()` with graceful fallback to `/journal`. Styled as a folded page-corner / ribbon with handwritten "‹ previous page".
- **JournalNav**: update TOC labels for swapped chapter order.

### 4. Colour Palette & Visual Style (`src/styles.css`)
- Replace dark leather palette with soft feminine luxury tokens: blush, dusty rose, champagne, ivory, warm cream, soft sage, muted lavender, soft gold.
- Update paper texture, gold-text, journal cover, and background gradients used in journal.tsx, chapter frames, JournalNav, KeepsakeInventory, PenEasterEgg.
- Keep animations and structure intact.

### 5. Shamar Companion
- Add `src/lib/shamar.ts` with the system-prompt text and greeting/reflection helpers.
- Add `src/components/ShamarCompanion.tsx`: a fixed, elegant floating companion (bottom-left) with the Shalom greeting, daily reflection card, and contextual suggestions based on current chapter path. Purely presentational (no AI backend wired yet) — offers Scripture suggestions, journaling prompts, and closing blessing from the provided prompt. Mount in `__root.tsx`.

### 6. Images
- The existing chapter hero images are already photographic. No new AI illustrations. Note in code comments that any future image must be photographic/cinematic (no illustrations).

### 7. Verification
- Typecheck build, load `/`, `/journal`, `/chapter/garden`, `/chapter/memories`, `/chapter/woman`, `/chapter/dreams` in Playwright and screenshot each.

### Technical notes
- Chapter IDs remain unchanged to preserve localStorage bookmarks and keepsake inventory keys; only `number` and ordering change.
- Palette swap is done via CSS variables so components inherit automatically; per-component inline `oklch()` values will be tuned to the new tokens where they exist.
- Shamar is a UI-only companion in this pass; wiring to an AI Gateway can follow in a later request.
