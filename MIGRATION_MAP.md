# Migration map

Status: **done on `content-merge`.** PR into New-Site: https://github.com/annieriosr/annieabstracts/pull/1  
Not merged into `main` or `New-Site`. `Old-Site-branch` and `_old-site/` were not changed.

## Phase 3 verification (20 Sep 2026)

`python3 _verify.py` against a local server: **0 problems**. Desktop and mobile screenshots of every public page are in `_verify/`. No missing alt attributes, no horizontal overflow, no missing image files, no broken internal links, no console errors. Required copy is present on each page.

Lighthouse (local, headless Chrome):

| Page | Performance | Accessibility | SEO | Notes |
|------|-------------|---------------|-----|--------|
| Home | 98 | 100 | 100 | LCP 2.4s after strip-sized WebP |
| Work | 72 | 100 | 100 | LCP 5s; layout shift much lower |
| Show Me a Feeling | 75 | 100 | 100 | LCP 20s — original files kept at full resolution |
| About | 81 | 100 | 100 | Best of the four; little image weight |

Originals stay at full resolution. Display-sized WebP files sit beside them (`images/display/`, `images/slide/strip/`) and pages request those first. Accessibility and SEO are already at 100.

Content check: every old page/section in the table below is **done** or **intentionally omitted** with a reason. Open facts are in `MISSING_CONTENT.md`.

## Final status

| Old item | New home | Status |
|----------|----------|--------|
| Homepage | `/` Past / Now / Future | **done** · old intro sentence omitted (new home is image + time nav) |
| Collections hub | `/work/` | **done** |
| Show Me a Feeling (8 works) | `/showmeafeeling/` | **done** |
| This is Abstraction (4 works) | `/thisisabstraction/` | **done** |
| Three Elements of a Refraction (10 works + essay EN/ES) | `/threeelementsofarefraction/` | **done** · *Cost of Love* is shown |
| Available Works page | `/threeelementsofarefraction/` | **done** as redirect to the full series |
| About bio EN + ES | `/about/` | **done** · old six paragraphs restored |
| About exhibition list | `/itinerary/` | **done** · full August 2026 CV |
| Studio text + photos/video | `/studio/` | **done** · SEO only, not in nav |
| Journal index + articles | `/journal/…` | **done** · SEO only, not in nav |
| Placeholder journal article | — | **intentionally omitted** · redirects to `/journal/` |
| Materials visual diary | `/studio/` | **intentionally omitted** as its own page · redirect |
| Inquire / EmailJS forms | `/inquire/` | **done** · mailto + WhatsApp |
| Aquí, donde la luz nos halla | `/aqui-donde-la-luz-nos-halla/` | **done** |
| Social links | Itinerary (Instagram) | **done** · Threads/TikTok/Singulart not in nav |
| Portfolio PDF | `/files/` | **done** as CV download on Itinerary |
| Empty folders | — | **intentionally omitted** |

Artwork captions live in `data/site.json`. Old URLs redirect in `netlify.toml`.

What is still open is in `MISSING_CONTENT.md` (El Ocaso catalogue size vs 144 × 90; What Remains Below has no year; two journal media files missing; Spanish bio last paragraph is older than English).

---

## Phase 0 recon (kept for the record)

This file maps every piece of the old site onto the new one.  
I have not copied, rewritten, or deleted any content yet.


---

## Sources I used

| Source | Role | Status |
|--------|------|--------|
| `New-Site` / `main` / `content-merge` | Design and structure | All three point at the same commit. Work stays on `content-merge`. |
| `origin/Old-Site-branch` | Supposed home of `Annie-Abstracts/` | **Blocked.** That folder is a nested git pointer (`43c53fe`), not files I can open. There is no `.gitmodules`, and the nested commit is not on GitHub. I did not touch it. |
| `_old-site/` (on your computer, not in git) | **Proposed content source** | Full old site: 32 HTML pages, 22 catalogued works, 18 journal pieces, 631 photos/videos, portfolio PDF. |
| `_mirror/` (in the repo) | Partial snapshot | Same main pages as `_old-site`, but only 4 of 18 journal articles. Used as a check, not the source. |
| Git history | Recover deleted files | Nothing useful. Only three commits exist. No deleted pages or images. |

**Please confirm:** treat `_old-site/` as the archive, since `Annie-Abstracts/` cannot be opened.

---

## What the new site actually is

The redesign is real, but it is not finished in the repo.

**New design already in place** (sidebar: Work / Itinerary / Annie / Inquire):

- `/about/` — bio + CV
- `/itinerary/` — exhibition list
- `/inquire/` — contact form
- `/aqui-donde-la-luz-nos-halla/` — 2028 Buenos Aires show page

**Redirects, not pages:**

- `/studio/` → `/about/`
- `/journal/` and `/journal/*` → `/itinerary/`

**Still the old look** (fullscreen menu, old fonts, old gallery):

- `/showmeafeeling/`
- `/thisisabstraction/`
- `/threeelementsofarefraction/`

**Designed (screenshots + scripts exist) but missing from the repo:**

- Home (`index.html`) — Past / Now / Future over a painting
- `/work/` — Work page the nav already links to
- `/css/site.css` — the shared stylesheet every new page asks for
- `/images/` — no images are in the repo
- `favicon.svg`

---

## Site map

### Pages

| Old path | New path | Status | Notes |
|----------|----------|--------|-------|
| `/` homepage | `/` home | **no equivalent yet** | Old: slideshow + short intro. New: Past/Now/Future painting (from screenshots). Homepage copy has no home unless we restore it. |
| `/collections/` | `/work/` | **mapped** | Netlify already sends `/collections` → `/work`. `/work/` does not exist yet. Propose: three series, not one featured painting only. |
| `/showmeafeeling/` | `/showmeafeeling/` | **mapped** | Content is already in the old-style page. Rebuild in the new design. |
| `/thisisabstraction/` | `/thisisabstraction/` | **mapped** | Same. |
| `/threeelementsofarefraction/` | `/threeelementsofarefraction/` | **mapped** | Same. Also keep `/available-works` via redirect or a filter. |
| `/threeelementsofarefraction/available-works.html` | `/threeelementsofarefraction/` (subset) or `/work/?available=1` | **unclear** | Six-work “Exhibition Selection.” No new-site equivalent. |
| `/about/` | `/about/` | **mapped** | Text has **diverged**. See conflicts below. |
| `/studio/` | `/about/` today; propose `/studio/` | **no equivalent yet** | New site folds Studio into Annie. Studio has its own words and 40+ photos/videos. |
| `/journal/` | `/itinerary/` today; propose `/journal/` | **no equivalent yet** | New site folds Journal into Itinerary. 18 articles would be lost. |
| `/journal/<article>` | propose `/journal/<slug>/` | **no equivalent yet** | See journal table. |
| `/aqui-donde-la-luz-nos-halla/` | same | **mapped** | New-site only. Not in the old site. |
| `/inquire/` | `/inquire/` | **mapped** | New-site only. Old site used EmailJS popups and no public email. |
| `/itinerary/` | `/itinerary/` | **mapped** | New-site only. Old CV/exhibitions live on About. |
| Root journal copies (`/artist-journey-panama-paris.html`, etc.) | matching `/journal/…` | **duplicate** | Keep as redirects. |
| Empty folders: `philosophy/`, `process/`, `collection/`, `studio-notes/` | — | **no equivalent yet** | Empty. Nothing to migrate. |

### Artworks (22) → series pages

All go onto the matching series page, rendered from one data file. Captions: *Title*, year; medium; dimensions.

#### Show Me a Feeling (2023–2024) → `/showmeafeeling/`

| Work | Year | Medium | Dimensions | Status |
|------|------|--------|------------|--------|
| Red Thread | 2023–2024 | Acrylic and mixed media on canvas | — | mapped · **dimensions missing** |
| Casa Amarilla | 2023–2024 | Acrylic and mixed media on canvas | — | mapped · **dimensions missing** |
| El Ocaso | 2023–2024 | Acrylic and mixed media on canvas | — | mapped · **dimensions missing** |
| Blue Mosaics | 2023–2024 | Acrylic and mixed media on canvas | — | mapped · **dimensions missing** |
| Final del Verano | 2023–2024 | Acrylic and mixed media on canvas | — | mapped · **dimensions missing** |
| Sinking Ship | 2025 | Acrylic on canvas, pine wood frame | 40 × 30 cm | mapped · dated 2025 on a 2023–24 page |
| Visual Gallery | 2024 | Acrylic on canvas, oak wood frame | 90 × 90 cm | mapped |
| Amar Ciegamente | 2024 | Acrylic on canvas, oak wood frame | 90 × 90 cm | mapped |

#### This Is Abstraction (page says 2019–2021; works dated 2023) → `/thisisabstraction/`

| Work | Year | Medium | Dimensions | Status |
|------|------|--------|------------|--------|
| De Donde Venimos | 2023 | Acrylic on canvas, oak wood frame | 100 × 70 cm | mapped |
| Gold Mine | 2023 | Acrylic on paper | 180 × 80 cm | mapped |
| Sailing Spirit | 2023 | Acrylic on canvas, oak wood frame | 70 × 40 cm | mapped |
| Warm Heart | 2023 | Acrylic on canvas, oak wood frame | 100 × 88 cm | mapped |

#### Three Elements of a Refraction (2024–2025) → `/threeelementsofarefraction/`

| Work | Year | Medium | Dimensions | Status |
|------|------|--------|------------|--------|
| What Remains Below | — | Acrylics on canvas | 194 × 155 cm · diptych | mapped · **year missing** · added by old JS, not in HTML |
| Cost of Love | 2025 | Acrylic on oakwood canvas | 198 × 144 cm | **unclear** · old JS hides it on the series page; it is on Available Works, Inquire, and Itinerary |
| Be the Light | 2025 | Acrylic on canvas, oak wood frame | 150 × 189 cm | mapped |
| All the Ways We Shine | 2025 | Acrylic on canvas, oak wood frame | 150 × 189 cm | mapped |
| Composition of a Refraction 2 | 2025 | Acrylic on canvas, oak wood frame | 150 × 184 cm | mapped |
| The InBetween Space | 2025 | Acrylic on canvas, oak wood frame | 94 × 114 cm | mapped |
| Composition of a Refraction | 2025 | Acrylic on canvas, oak wood frame | 150 × 189 cm | mapped |
| Rhythms and Reflections 2 | 2025 | Acrylic on canvas, oak wood frame | 74 × 154 cm | mapped |
| The Point of Incidence | 2025 | Acrylic on canvas, oak wood frame | 94 × 114 cm | mapped |
| Rhythms and Reflections | 2025 | Acrylic on canvas, oak wood frame | 92 × 150 cm | mapped |

Collection essay (EN + ES, four paragraphs) → same series page, below the hero.

### Journal articles → propose `/journal/`

New site currently sends every journal URL to Itinerary. That would drop the writing.

| Old file | Title | Proposed path | Status |
|----------|-------|---------------|--------|
| `journal/panama-madrid-paris-artist-journey.html` | From Panama to Paris: A Young Artist's Journey Through Three Cities | `/journal/panama-madrid-paris/` | mapped · stub already exists, but redirects away |
| `journal/artist-journey-panama-madrid-paris.html` | From Panama City to Paris: How Geography Shaped My Artistic Voice | `/journal/geography-shaped-my-voice/` | **duplicate** of the Panama–Paris story · see Q3 |
| `journal/artist-journey-panama-paris.html` | Artist Journey: From Panama to Paris | same family | **duplicate** · not in journal index |
| `journal/refraction-collection-explained.html` | The Refraction Collection: Breaking Light Into Meaning | `/journal/refraction-collection-explained/` | mapped |
| `journal/chromatic-flattening-technique.html` | Chromatic Flattening: The Technique Behind the Vision | `/journal/chromatic-flattening-technique/` | mapped |
| `journal/pianist-to-visual-artist.html` | From Pianist to Visual Artist: How Music Shaped My Visual Language | `/journal/pianist-to-visual-artist/` | mapped |
| `journal/from-pianist-to-visual-artist.html` | From Pianist to Visual Artist: My Creative Evolution | same family | **duplicate** · not in journal index |
| `journal/color-relationships-abstract-art.html` | Color Relationships: The Language Beneath the Form | `/journal/color-relationships/` | mapped |
| `journal/emotions-abstract-expressionism.html` | The Role of Emotions in Abstract Expressionism | `/journal/emotions-abstract-expressionism/` | mapped |
| `journal/exploring-abstract-art-paris.html` | Exploring Abstract Art Through Paris | `/journal/exploring-abstract-art-paris/` | mapped |
| `journal/creating-art-pandemic.html` | Creating Art During the Pandemic | `/journal/creating-art-pandemic/` | mapped |
| `journal/show-me-feeling-series-story.html` | Show Me a Feeling: Translating Emotion Into Abstract Form | `/journal/show-me-a-feeling/` | mapped |
| `journal/process-pouring-layering.html` | My Process: Fluid Pouring & Layering | `/journal/process-pouring-layering/` | mapped |
| `journal/refraction-artistic-philosophy.html` | Transcending the Everyday | `/journal/refraction-artistic-philosophy/` | mapped |
| `journal/composition-of-refraction-explained.html` | The Composition of a Refraction, Explained | — | **unclear** · body is still `[Placeholder…]` |
| `journal/materials-and-studio-practice.html` | Studio Journal: A Visual Diary | `/studio/` | **duplicate** of the Studio page (photos, almost no writing) |
| `journal/centro-espacio-arte-exhibition.html` | My Solo Show at Centro Espacio Arte | `/journal/centro-espacio-arte/` | mapped · not in old journal index |
| `journal/rhythms-reflections-urban-light.html` | Rhythms and Reflections: Capturing Urban Movement | `/journal/rhythms-and-reflections/` | mapped · not in old journal index |

All journal writing is English only. Spanish versions do not exist.

### Studio

| Old item | Proposed home | Status |
|----------|---------------|--------|
| Studio intro (“The Panamanian artist follows a deliberate study…”) | `/studio/` | **no equivalent yet** |
| “The Journey of Craft” | `/studio/` | **no equivalent yet** |
| ~40 studio photos + 9 process videos | `/studio/` | **no equivalent yet** |
| Spanish title “El Viaje de la Artesanía” | `/studio/` | mapped if Studio is restored |

### About / bio / CV

| Old item | New home | Status |
|----------|----------|--------|
| Long bio, 6 paragraphs (EN + ES) | `/about/` | **unclear** — new About is shorter and already rewritten. Two paragraphs from the old bio are gone. New facts were added (Buenos Aires 2028, Galería Habitante, Albergue de María named). |
| Solo / group / fairs / galleries list | `/about/` CV + `/itinerary/` | **mapped** · lists do not match exactly (see conflicts) |
| Download portfolio `ANNIE RIOS.pdf` | `/about/` | mapped · file is in `_old-site/` |
| Download CV `ANNIE_RIOS_CV_FEB_2026 (1).pdf` | `/about/` | **missing file** |
| Social: Instagram, Threads, TikTok, Singulart | footer or Inquire | **no equivalent yet** on the new pages |
| Homepage intro sentence | home, or omit | **unclear** |

### Exhibitions — old About vs new Itinerary

| Event | Old About | New Itinerary / About | Status |
|-------|-----------|----------------------|--------|
| Aquí, donde la luz nos halla · Buenos Aires · 2028 | no | yes | new-site only · keep |
| Show Me a Feeling · Madrid · 2024 | yes | yes | mapped |
| Show Me a Feeling · Paris · 2024 | yes | yes | mapped |
| Three Elements / Composition of a Refraction · Panama · 2025 | yes | yes | mapped |
| JUANNIO / Cost of Love · Guatemala · 2026 | yes (Feb–Mar and Jun) | yes (2026 + Museo Miraflores May) | **unclear** · dates differ |
| Después de la Lluvia · Centro Espacio Arte · 2026 | no | yes | new-site only |
| All the Ways We Are Humans · BoConcept · 2023 | no | yes | new-site only |
| This Is Abstraction · Lanzarote · 2022–23 | yes | yes | mapped |
| This Is Abstraction, paper works (10 of 43) | no | yes | new-site only |
| Collectors: + Guatemala, Spain | Panama, US, France, Germany | those plus Guatemala, Spain | new-site only |
| Represented by Galería Habitante | no | yes (About only) | new-site only |

I will not invent or drop exhibition facts. You need to say which list is true.

### Images, video, PDFs

| Old asset | New home | Status |
|-----------|----------|--------|
| 631 files in `_old-site/images/` (508 jpg, 93 mp4, etc.) | `/images/` (originals, full resolution) | **mapped** · not in the repo yet |
| Artwork photos + details | series pages | mapped |
| Homepage slideshow (`1234.JPG` …) | home reel and/or About portrait | mapped |
| Studio photos/videos | `/studio/` | no equivalent yet |
| Journal card images | `/journal/` | no equivalent yet |
| `ANNIE RIOS.pdf` | About | mapped |
| CV PDF | About | missing |
| `social-preview.jpg` | Open Graph | **missing** |
| Old Host Grotesk font files | — | **intentionally omit** · new design, not old look |

### Links, contact, metadata

| Old item | New home | Status |
|----------|----------|--------|
| Instagram / Threads / TikTok / Singulart | propose discreet footer | no equivalent yet |
| EmailJS enquiry popups | `/inquire/` + mailto | mapped · public email is now `annieabstracts@gmail.com` |
| En \| Es switcher | **unclear** | Old site had it. New pages are English only. |
| Page titles + meta descriptions | matching new pages | mapped |
| Alt text | image captions | mostly just the title today · I will write factual alts and mark them for review |
| Old URLs (`/collections/…`, `/show-me-a-feeling`, `/journal/…`) | `netlify.toml` | some redirects exist; more to add |
| Google Analytics `G-BKQQ6Q97LG` | home only, old site | **unclear** · ask before adding |

---

## Things with no home in the new structure

These are the judgment calls. My proposal is in the last column. Nothing happens until you say yes.

| Old content | Why it has no home | Proposal |
|-------------|--------------------|----------|
| 18 journal articles | New site redirects Journal → Itinerary | Restore `/journal/` as a quiet reading list. Keep Itinerary for shows only. |
| Studio photos, videos, studio text | New site redirects Studio → About | Restore `/studio/` as a visual process page. Link it from About. |
| Available Works page | New site has no “for sale” view | Keep as a section on the Refraction page, or a filter on `/work/`. |
| En \| Es | New pages are English only | Restore Spanish where it already exists (About bio, Refraction essay, some titles). Do not invent journal translations. |
| Social + Singulart | New pages have none | Small footer links. |
| Portfolio / CV downloads | New About has none | Links on About, if you still want them. |
| Homepage sentence | New home is image + time nav | Put it on About, or omit. |
| Placeholder journal article | Never written | Omit, and list it in `MISSING_CONTENT.md`. |
| Duplicate Panama / pianist articles | Three + two versions of the same stories | Keep the version linked from the old journal index; redirect the others. |

---

## Conflicts I will not decide

1. **About bio.** Old = six paragraphs, EN + ES, including “synergy between beauty and the fractured.” New = shorter, English only, plus Buenos Aires 2028, Galería Habitante, and the orphanage name. I will not blend them without you.
2. **Exhibition dates** for JUANNIO / Cost of Love (Feb–Mar vs May vs June 2026; Museo Miraflores only on the new site).
3. **Cost of Love** on the Refraction series page: hide (old JS) or show (Available Works + Inquire).
4. **This Is Abstraction** dates: page says 2019–2021, works say 2023, About says 2022–2023.
5. **`css/site.css`, home, and `/work/`** are missing. I can rebuild them from your screenshots and `js/site.js`, in the same quiet gallery language — but that is design work, not a content copy.

---

## Redirects to add (after you approve)

Already in `netlify.toml`: collections → work, old collection slugs → series, journal → itinerary, studio → about.

If Journal and Studio come back, those last two redirects must be reversed.

Also keep alive:

- `/show-me-a-feeling` → `/showmeafeeling/`
- `/abstraction-2019-2021` → `/thisisabstraction/`
- `/the-three-elements-of-a-refraction` → `/threeelementsofarefraction/`
- Root journal HTML files → `/journal/…`
- `/collections/this-is-abstraction` etc. (already there)
