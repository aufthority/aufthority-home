# Handoff: Literature Review explainer

Session date: 9 October 2026 (build)

## 1. What was built

### Explainer (`edu/literaturereview/index.html`)

A single self-contained HTML carousel. It explains how to do a literature review in seven steps, and the four ways a review can be published: narrative, scoping, systematic, and meta-analysis. It is written in plain English, and it is a companion to `/edu/researchfundamentals`, linked from slide 1 and the final slide.

**Format.** Option C: the same Aufthority carousel shell as the sibling (buttons only, no swipe or keyboard), plus one idea borrowed from ConceptCraft. A recurring funnel visual (slides 4 and 8) acts as the signature diagram, and live interactives act as the "finale" (forest plot and decision tree). ConceptCraft itself was not used. It is scroll-driven, so it would behave inconsistently with the sibling; it has 5 stars and 7 commits; and its harness depends on a browser download.

**No-scroll rule.** Every slide fits one screen on phone, tablet and laptop. Three mechanisms make this work:
- The shell is locked to `100dvh`.
- Each diagram fills only the height that is left over.
- A small fit routine shrinks a slide's text by up to 30% if it would overflow, and re-runs on resize and after every interaction.

"Going deeper" content opens in an overlay sheet, so it never pushes the layout. The sheet itself can scroll on small phones; this matters for the sources list.

**Animation.** 2D toon-style SVG with CSS animation: a recurring pharmacist character, papers dropping, threads weaving, a sweeping spotlight, dots falling through the funnel, ticks being drawn, count-up numbers. Three.js was not needed. All motion switches off under `prefers-reduced-motion`.

**Depth.** The core is pitched at laypeople and diploma students. "Going deeper" sheets cover degree and postgraduate detail: I², fixed vs random effects, funnel plots, GRADE, RoB 2 and ROBINS-I, PRISMA-S, SWiM, the Arksey & O'Malley stages, and predatory journals.

**Running example.** It continues the sibling's fictional antibiotic-completion question. Every study, number, map and trial is labelled as made up. The page contains no real statistics.

**19 slides:**

1. Hook: nobody can read everything (toon pharmacist, growing paper pile)
2. A woven answer, not a pile of summaries (toggle: pile vs threads into themes)
3. Four kinds of review (spectrum from flexible to strict; tap a type to see what it asks) · deeper: other review types
4. Seven steps, one funnel (animated funnel)
5. Step 1: PICO builder (tap a letter to highlight its part of the question), PCC note · deeper: PCC, PEO, SPIDER, FINER
6. Step 2: AND / OR / NOT Venn with a "pile size" meter, a sample search string, truncation · deeper: search blocks, MeSH, PRISMA-S
7. Step 3: databases plus grey literature; snowballing diagram · deeper: Cochrane minimum sources, recording searches, deduplication
8. Step 4: screening funnel 1,240 → 930 → 64 → 15 with exclusion boxes and count-up · deeper: PRISMA 2020 flow diagram, screening tools
9. Step 5: six flip cards ("trust more / trust less") · deeper: RoB 2, ROBINS-I, JBI/CASP, Newcastle–Ottawa
10. Step 6: extraction table that animates in · deeper: piloting, dual extraction, "charting"
11. Step 7: toggle between a listing paragraph and a synthesis paragraph · deeper: thematic synthesis, SWiM, meta-aggregation, GRADE / CERQual
12. Narrative review (fact rows, spotlight-picking visual, effort meter)
13. Scoping review (evidence gap map with pulsing gaps; OSF registration, PRISMA-ScR) · deeper: Arksey & O'Malley stages, JBI 2020
14. Systematic review (animated checklist; PROSPERO, PRISMA 2020) · deeper: GRADE domains, PRISMA-P
15. Meta-analysis: **interactive forest plot.** Five made-up trials; tap to exclude a trial. It recomputes the fixed-effect pooled risk ratio, 95% CI and I² live, with a plain-English readout. · deeper: I² bands, fixed vs random effects, funnel plots
16. **Decision tree:** up to three yes/no questions lead to narrative, scoping, systematic, or systematic + meta-analysis
17. Getting published: register, follow the checklist, choose a genuine journal, answer reviewers; common rejection reasons · deeper: predatory journal signs
18. Summary: six takeaways
19. Keep going: link back to Research Fundamentals, stay in touch (email + five socials), Sources sheet (14 references)

**Look.** Same tokens as the sibling:

| Token | Value |
|---|---|
| Green | `#1f5c3f` |
| Gold | `#b8901f` |
| Gold text | `#8a6a10` |
| Light green | `#edf5ef` |
| Light gold | `#fbf6e6` |

Also the same as the sibling: DM Sans only, plain uppercase topic labels, English nav (Back / Next / Done), and the footer "Ask carefully. Answer honestly." with "Made by Aufthority".

New in this page:
- a muted rust (`#9a4a2e` on `#f8ece6`) for "trust less" and "excluded" states
- a two-column split layout on landscape screens 900 px wide and up, with the text column vertically centred

**Analytics.** Shared Umami ID `f79c60f1-f9e7-4170-a979-f357ba756a18`. Same core events as the sibling, plus page-specific ones:

| Event | Fires when |
|---|---|
| `slide-view` (slide), `nav-back`, `nav-next`, `carousel-selesai` | same as sibling |
| `toggle` (label) | a "going deeper" sheet opens |
| `weave-toggle`, `type-pick`, `pico-tap`, `boolean-mode`, `appraise-flip`, `synth-toggle` | slide interactives used |
| `forestplot-toggle` (trial, on) | a trial is toggled in the forest plot |
| `decision-result` (result) | the decision tree reaches a result |
| `sources-open` | the sources sheet opens |
| `companion-click` | a link to Research Fundamentals is clicked |
| `email-click`, `social-*` | same as sibling |

### Share image (`edu/literaturereview/og.png`)

1200×630, same composition as the sibling. On the left: headline "Literature reviews, simply explained.", a summary line, and four type chips. On the right: three tilted screenshots (hook, screening funnel, forest plot). The OG and Twitter tags point to `https://www.aufthority.com/edu/literaturereview/og.png`.

## 2. Files to commit

```
<repo root>/edu/
├── researchfundamentals/   (existing)
└── literaturereview/
    ├── index.html   new
    └── og.png       new
```

## 3. Verification done

- **Fit check, all 19 slides, eight viewports:** 360×640, 390×664, 430×820, 820×1080, 1180×740, 1366×657, 1440×800, 1920×960. There is no vertical or horizontal overflow anywhere, and no JavaScript errors.
  - Text shrink was needed on only three slides on small phones: 5, 17 and 13 at 360 px. The worst case is 88% (slide 17 at 360×640).
  - Tablets and laptops run at full size.
- **Interactions** were clicked through at 360×640 and 1366×657 and re-checked for overflow afterwards. This covered every toggle, PICO tiles, the Boolean modes, all six flip cards, the synthesis toggle, forest plot toggles (including all trials off), a full decision-tree path, and the deeper and sources sheets.
- **Forest plot maths.** With all five trials on, the pooled RR is 1.18 (1.07–1.30) and I² is 38%. Excluding Trial D gives RR 1.24 and I² 0%, which is a useful teaching moment about heterogeneity.
- **Source checks.** Current editions were confirmed this session:
  - Cochrane Handbook v6.5 (2024)
  - JBI Manual 2024 edition
  - PRISMA-ScR 2018 is still the current version; an update is in development
  - PROSPERO does not accept scoping reviews
- **Not verified:**
  - the deployed page
  - real DM Sans rendering (the test browser used a fallback font; DM Sans is slightly narrower, so it should only add room)
  - Umami events in production
  - the guessed Instagram, TikTok and Threads URLs (carried over from the sibling)

## 4. TODO after deploying

1. Open `/edu/literaturereview` with and without the trailing slash. Use the same 404 and homepage fixes as in the Research Fundamentals handoff.
2. Open `/edu/literaturereview/og.png` directly, then test the page on opengraph.xyz.
3. Click through all 19 slides on a real phone and a laptop. Check that the bottom buttons sit above the browser toolbar on iOS Safari; the page uses `100dvh` and safe-area padding.
4. Optionally, add a "Next: literature reviews" link from the sibling's Step 2 slide (8) or its final slide. This is not done, to keep the sibling untouched.

## 5. Known limitations and open items

- **Deviations from the carousel skill** are the same as the sibling: English, no serif, custom palette, plain labels.
- **New, deliberate:** the sources are in a sheet opened from the last slide instead of an always-visible source box, because the no-scroll rule wins on phones.
- **Footer tagline** kept as "Ask carefully. Answer honestly." for consistency. The last slide's headline "Read widely. Weigh fairly." could replace it on this page if you prefer.
- **The sources sheet scrolls** inside the overlay on small phones. It is the only scrolling surface on the page.
- **Fixed-effect model only** in the forest plot demo. This is stated in the deeper sheet.
- **`twitter:site` is still `@theaufthority`**, inherited from the template.
- **Not done:** a BM version, dark mode, and a link from aufthority.com navigation.

## 6. Decisions log

| Decision | Choice |
|---|---|
| Format | C: carousel shell + ConceptCraft-style signature funnel and live finale (ConceptCraft itself not used) |
| URL | `www.aufthority.com/edu/literaturereview` |
| Depth | Lay/diploma core; degree and postgraduate detail in "going deeper" sheets |
| Sources | Standard methodology (Cochrane Handbook, JBI Manual, PRISMA family, SANRA, GRADE), cited in the sources sheet on the last slide |
| Screen fit | Every slide fits without scrolling on phone, tablet and laptop (Auf's requirement) |
| Animation | 2D toon SVG; Three.js not needed |
| Running example | Continues the sibling's fictional antibiotic-completion question |
