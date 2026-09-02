# TSSD Portal — Website Development Plan, Page Hierarchy & Layout Specification

## 1. Information Architecture (Sitemap)

### Top Header Navigation (sticky, glassmorphism)
```
[Emblem + TSSD | Department Name]   Home · Programs · Safety Quiz · News · Resources · Contact   [Emergency 999] [EN/AR]
```
- Emergency hotline pill (red) always visible; language switcher toggles EN (LTR) ↔ AR (RTL) globally.
- Mobile: hamburger menu with identical links + hotline.

### Alert Ticker (above-the-fold, top of every page)
- Infinite marquee of live urgent announcements (red band) served from `/api/announcements`.

### Footer Menu Layout (4 columns)
1. Brand — emblem, department name, mission line.
2. Quick Links — mirrors top nav (Home / Programs / Quiz / News / Resources / Contact).
3. Emergency Hotlines — 999 · Traffic Hazard 800 7233 · Switchboard 04 555 0100.
4. Contact — HQ address, office hours, Staff Portal (/admin) link.
- Bottom bar: copyright + WCAG 2.1 AA / EN·AR conformance note.

## 2. Homepage Layout & Section Wireframe (top → bottom)

1. **Alert Ticker** — urgent public ads/announcements placement #1 (always visible, pauses on hover).
2. **Hero** — full-bleed road photograph with parallax + grain, masked line-by-line kinetic headline "Precision Safety on Every Road.", dual CTAs (Take the Safety Quiz / Report a Traffic Concern), and a live metrics bar (24/7 surveillance, 98.4% compliance, −12% collisions, 214 schools).
3. **Editorial marquee** — slow amber-on-navy safety manifesto strip.
4. **Announcements & Alerts** — urgent public ads placement #2: 3-card grid, urgent cards get red border + animated tracing beam.
5. **Chapter 01 — Active Safety Initiatives** — 4 program cards with photography, stat mono-labels, hover zoom.
6. **Chapter 02 — Safety Quiz widget** — placed mid-page (~60% scroll depth, immediately after programs and before news) to maximize engagement: visitors have context from programs, and the quiz acts as an interactive "valley-breaker" between two reading-heavy sections. Full 8-question interactive widget embedded directly, plus dedicated /quiz page.
7. **Chapter 03 — News & Bulletins** — 3 latest bulletins with category badges.
8. **Chapter 05 teaser — Emergency strip** — dark panel with hotline cards + contact CTA.
9. **Footer** (as above).

## 3. Page Breakdown & Content Outline

- **Home (/)** — hero, alerts, programs preview, embedded quiz, news preview, emergency strip.
- **Programs (/programs)** — editorial alternating rows for the 4 flagship initiatives: School Zone Zero-Speed, Child Seat Fitting Stations, Night Visibility Campaign, Fleet Safety Audits (stat, description, photography each).
- **Safety Quiz (/quiz)** — National Traffic Safety Knowledge Check: 8 scenario MCQs, progress bar, instant correct/incorrect feedback, legal/safety explanation per answer, final % score, ≥80% earns "Certified Road Safety Aware" badge, retake. Results anonymously logged for statistics.
- **News (/news)** — filterable bulletin archive (All / Urgent Alerts / New Laws / Statistics / Press Releases), expandable full text, urgent items get tracing-beam highlight.
- **Resources (/resources)** — download center: Driver Handbook 2026, Child Seat Guide, Fines & Penalty Schedule, School Transport Protocol, Pedestrian & Cyclist Guide — each as a generated PDF via `/api/resources/{id}/download`.
- **Contact (/contact)** — enquiry form (stored in DB), emergency hotlines, office hours, HQ address.
- **Staff Portal (/admin)** — JWT login, enquiry dashboard with stat cards, status filters (Pending / In Progress / Resolved), one-click status changes, CSV export.

## 4. Tech Stack & Accessibility

- **Frontend**: React 19 + Tailwind CSS, framer-motion (scroll reveals, quiz transitions), lenis (smooth scroll), lucide-react icons.
- **Backend**: FastAPI + MongoDB (motor), JWT admin auth (bcrypt), reportlab PDF generation.
- **Accessibility**: WCAG 2.1 AA — 4.5:1 text contrast, ≥44px touch targets, labelled form fields, keyboard-operable quiz, focus rings, `dir` attribute RTL mirroring, Arabic typefaces (Cairo/Readex Pro) with increased line-height, marquee pauses on hover, descriptive data-testids.
- **i18n**: full EN/AR translation dictionary with instant switch and persisted document direction.
