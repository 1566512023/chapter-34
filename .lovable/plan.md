This is a large restructure. Here's what I'll build so we align before I start.

## Copy corrections (global)
- "Friend" / "Best Friend" → "Sister"
- "Life Partner" → "Partner"
- "Her calling through the law" → "Her calling through law"
- Strip all instructional/meta prose ("This chapter should feel like…", "Visitors can explore…") from user-visible copy. That text was showing up as journal notes; it will be replaced with in-world narration, captions, and interactive elements instead.

## Architecture change
Right now `/journal` renders every chapter as similar parchment pages. I'll change it to:

- `/` — Prologue desk (unchanged shell; polish only). The journal opens into the Table of Contents.
- Table of Contents lists the 16 chapters (Prologue + 16 + Epilogue). Selecting a chapter triggers a **page-flip transition** and routes to its own immersive world.
- `/chapter/$id` dynamic route loads a chapter-specific component from a registry. Each chapter is its own React module with its own palette, background, motion, and interactions — not a shared template.
- A persistent silk-ribbon bookmark + "Return to Journal" corner control on every chapter.
- Page-flip transition component (CSS 3D rotateY) wraps route changes between chapters.

## The 16 chapter worlds (each a distinct scene)
1. **Before Time Began** — sunrise gradient, drifting clouds, baby/childhood photo cards fade in on scroll, pressed-flower hotspots reveal memories.
2. **Thus Far** — winding golden path SVG; Ebenezer stones as clickable nodes → modal with photos + reflection.
3. **Garden That Helped You Bloom** — botanical scene; clickable flowers/butterflies open cards for **Granny, Sister, Mother, Father, mentors** (add-your-own slots included).
4. **Her Foundation** — sanctuary with 4 pillars (God / Family / Law / Legacy); click a pillar → panel slides in with scripture + reflection.
5. **The Woman You Have Become** — portrait gallery: Woman of Faith, Mother, **Partner**, Lawyer, Leader, Business Owner, **Sister**. Click a portrait → lightbox.
6. **Called With Purpose** — law-office floorplan; rooms unlock by year (2021 → today); certificates & milestones as clickable frames.
7. **Little Hands, Big Love** — warm home; memory board with drawings, photos, letters. Zane featured; open slots for future children.
8. **Letters for the Future** — antique writing room; drawer of sealed envelopes (God, Zane, Future Children, Future Self, Family) — click to unfold handwritten letter.
9. **God's Faithfulness** — night sky; **clickable stars** = answered prayers; constellations = testimonies. Star click opens a small card.
10. **Dreams God Placed in Your Heart** — artist studio wall of vision cards; completed dreams glow, pending dreams shimmer softly.
11. **Book of Memories** — library shelves per year; click an album → spread of photos/notes.
12. **God's Love Letter** — Scripture room; illuminated Bible in center; topic tabs (Fear, Hope, Peace, Joy, Purpose, Grace, Identity) unfold verses as letters.
13. **Prayer Room** — candlelit sanctuary; tabs for Prayers, Praises, Answered Prayers, Devotionals, Worship, Bible Studies.
14. **His Verdict** — courtroom; case file "A Life Redeemed" turns page by page to reveal the five stamps.
15. **Legacy** — hall with growing family tree SVG; clickable branches for letters, family values, crest, and **Time Capsule** (clickable entries: 35th, 40th, Zane's 18th, Christmas, 10 years).
16. **Future Chapters** — blank leather journal "Chapter 35" with fountain pen; button "Continue the Journey" loops back to the TOC.

## Content strategy
Every clickable element opens a small modal or side-drawer with a title, optional image, and a short reflection. Since I don't have the real photos/text yet, I'll seed each with a placeholder image (generated warm-toned assets) and a short scripture/reflection so the experience feels populated. All content lives in `src/data/chapters/*.ts` so you can hand me real photos/text later and I swap them in cleanly.

## Technical notes
- New route: `src/routes/chapter.$id.tsx` with a chapter registry `src/chapters/index.tsx` mapping id → component.
- Shared primitives: `PageFlip`, `ChapterFrame` (bookmark + back), `Hotspot`, `RevealCard`, `Modal`.
- Motion via CSS keyframes already in `styles.css`; extend with a `page-flip` keyframe.
- Palette per chapter via CSS variables scoped on `ChapterFrame`.
- Generate ~6 hero background images (sunrise, garden, sanctuary, night sky, library, courtroom) with imagegen; reuse across chapters. Add small placeholder portrait/photo cards.
- Localstorage bookmark keeps last visited chapter.

## Scope note
Sixteen fully bespoke worlds is a lot. I'll build all 16 in this pass at a solid first-pass fidelity (distinct look, working interactions, seeded content, images where they matter most). Later iterations can deepen individual chapters (sound design, richer photo galleries, real voice notes, etc.) as you feed me content.

Approve and I'll build it.