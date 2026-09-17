# Silver State Technology Conference 2026 — social posting kit

We're presenting **MAGIC: Human-Centered AI for Beginners** at the Silver State
Technology Conference, hosted by NV-SIDE (Nevada Society of Innovators and
Digital Educators).

- **When:** Friday, October 10, 2026, 9:00 am – 5:30 pm
- **Where:** Aldeane C. Ries, Las Vegas, NV
- **Session:** MAGIC — Human-Centered AI for Beginners
- **Conference:** https://nvside.org
- **Our page:** https://theintelligenthoodlums.com/events#silver-state-2026

Everything here is ready to drop into SocialBee. Each platform has a sized card
and a caption written for that platform.

## The cards

| Platform  | File | Size | Notes |
|-----------|------|------|-------|
| Facebook  | `silver-state-2026-facebook-1200x630.png`  | 1200 × 630  | Landscape feed / link card. |
| LinkedIn  | `silver-state-2026-linkedin-1200x627.png`  | 1200 × 627  | Landscape feed. |
| Instagram | `silver-state-2026-instagram-1080x1350.png` | 1080 × 1350 | 4:5 portrait, the tallest the feed allows. |
| TikTok    | `silver-state-2026-tiktok-1080x1920.png`   | 1080 × 1920 | 9:16 vertical. Content sits clear of the bottom UI rail. |

All four are on brand: Grift Black on Ink, the Rufous rule, Tuscany accents, and
the badge watermark, matching the site.

## Co-branding

The cards are our aesthetic, co-branded with NV-SIDE. The suggested flyer's "I'm
presenting at..." banner becomes the eyebrow, the where / when / time ribbon
becomes the detail line, and the NV-SIDE mark sits in a "Presented at" lockup in
the footer next to our wordmark. The logo file lives at `assets/nvside-logo.png`
(a transparent PNG reads cleanest; a black-background square is framed by the
lockup so its edge looks intentional).

---

## Facebook

We're taking the show to the Silver State Technology Conference. 🎪

Our session is **MAGIC: Human-Centered AI for Beginners** — a plain-language,
human-first way to bring AI into your classroom, built for teachers who are not
sure where to start. No jargon, no hype, no binder. Just the useful part.

Friday, October 10, 9:00 am to 5:30 pm, at Aldeane C. Ries in Las Vegas, hosted
by NV-SIDE. Coming? Say hi — we'll save you a seat.

Conference details 👉 https://nvside.org

#TeacherPD #Teachers #Education #AIinEducation #EdTech #NVSIDE

---

## LinkedIn

We're presenting at the Silver State Technology Conference on Friday, October 10.

Our session, **MAGIC: Human-Centered AI for Beginners**, is for the teachers who
keep hearing they should "use AI" and have no idea where to start. We keep it
plain-language and human-first: what the tools are actually good for in a
classroom, what to hand them and what to keep, and how to try it without
rebuilding your practice around it.

9:00 am – 5:30 pm, Aldeane C. Ries, Las Vegas, hosted by NV-SIDE (Nevada Society
of Innovators and Digital Educators).

If you'll be there, come find us: https://nvside.org

#ProfessionalDevelopment #Education #AIinEducation #Teachers #EdTech #NVSIDE

---

## Instagram

MAGIC: Human-Centered AI for Beginners. ✨

We're presenting at the Silver State Technology Conference, hosted by NV-SIDE. A
plain-language, human-first way to bring AI into your room — built for teachers
who are not sure where to start.

Friday, October 10 · 9a–5:30p · Aldeane C. Ries, Las Vegas.

Coming to Silver State? Tell us in the comments. 🎪
.
.
#TeacherPD #Teachers #TeachersOfInstagram #AIinEducation #EdTech #TeacherLife #NVSIDE #LasVegas

---

## TikTok

We're bringing AI for beginners to the Silver State Technology Conference.
Human-first, plain-language, no jargon. Session's called MAGIC. Friday, Oct 10,
Las Vegas. Come say hi. ✨

#teachertok #teachersoftiktok #teacherlife #teacherpd #aiineducation #edtech #nvside

---

## The facts, if you need to remix

- Session: MAGIC — Human-Centered AI for Beginners
- Silver State Technology Conference, hosted by NV-SIDE
- Friday, October 10, 2026, 9:00 am – 5:30 pm
- Aldeane C. Ries, Las Vegas, NV (in person)
- Conference: https://nvside.org
- Our events page: https://theintelligenthoodlums.com/events#silver-state-2026

---

## Regenerating the cards

The cards are rendered from `generate-cards.mjs` (Grift fonts and the badge are
read straight from the repo and embedded, so the output is self-contained).

```
cd social/silver-state-2026
ln -s /opt/node22/lib/node_modules node_modules   # or: npm i playwright
node generate-cards.mjs
```

Edit the copy or the presets in that file and rerun to reflow every card.
