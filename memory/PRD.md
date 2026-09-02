# PRD — Traffic Safety Services Department (TSSD) Portal

## Original Problem Statement
Expert UX/UI + Web Architect plan and build for a government traffic safety information portal: department branding, interactive safety quiz, safety programs, public announcements, news/newsletter archive, downloadable resource center, contact & emergency info. Deliverables: IA/sitemap, homepage wireframe, page breakdowns, tech stack & accessibility. User choices: full build; scored quiz with explanations; contact form stored in DB with admin area; EN/AR language switcher; designer-chosen civic branding. Elevated to Awwwards-level craft (kinetic hero, masked reveals, marquee, framer-motion, lenis, parallax).

## Architecture
- Frontend: React 19, Tailwind, framer-motion, lenis, lucide-react, sonner. Fontshare Cabinet Grotesk + Google (Plus Jakarta Sans / Cairo / Readex Pro / JetBrains Mono).
- Backend: FastAPI + MongoDB (motor). JWT admin auth (bcrypt, brute-force lockout), reportlab PDF generation.
- Key files: backend/server.py, backend/seed_data.py; frontend/src/i18n.js (EN/AR dictionary + LanguageProvider), components/{Header,Footer,AlertTicker,QuizWidget,Reveal}, pages/{Home,Programs,QuizPage,News,Resources,Contact,Admin}.

## User Personas
- Local driver checking rules/fines; parent seeking child-seat guidance; school community member; pedestrian/cyclist; department staff handling enquiries.

## Core Requirements (static)
Branding header + contact directory; interactive scored quiz; programs showcase; urgent announcement banners; news archive; downloadable resources; contact form + hotlines/hours/address; EN/AR RTL; WCAG AA.

## Implemented (2026-09-02)
- Full website plan doc: /app/memory/WEBSITE_PLAN.md
- Home: alert ticker marquee, parallax kinetic hero with masked line reveal + metrics bar, editorial marquee, announcements grid, programs (Ch.01), embedded quiz (Ch.02), news preview (Ch.03), emergency strip, 4-col footer.
- Quiz: 8 bilingual MCQs from API, progress bar, instant feedback + legal explanation, % score, ≥80% badge, results logged to DB.
- Programs, News (category filters + expandable bodies), Resources (5 guides, live PDF download), Contact (form → DB, hotlines, hours, address).
- Admin (/admin): JWT login, stat cards, status filters, mark in-progress/resolved, CSV export.
- EN/AR switcher with full RTL mirroring; data-testids on all interactive elements.

## Verified
All API endpoints via curl (health, announcements, quiz, news, resources, PDF, enquiry POST/GET/PATCH, CSV export, 401 guard, admin login). UI via screenshots: hero, quiz answer+explanation, Arabic RTL, contact submit toast, admin dashboard.

## Backlog
- P1: Admin-managed announcements/news (CRUD UI); newsletter email subscription (Resend); search.
- P2: Quiz topic filters + certificate PDF; Arabic-shaped PDF downloads; interactive HQ map.
- P2: Dark mode toggle; more languages.

## Test Credentials
admin@tssd.gov / TrafficSafe2026! (see /app/memory/test_credentials.md)
