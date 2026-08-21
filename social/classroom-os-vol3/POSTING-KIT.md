# ClassroomOS Vol. III — social posting kit

Everything here is ready to drop into SocialBee. Each platform has a sized card
and a caption written for that platform. The registration link is the same
everywhere: **https://luma.com/d18q3tcw**. The landing page is
**https://theintelligenthoodlums.com/classroom-os-volume-3**.

## The cards

| Platform  | File | Size | Notes |
|-----------|------|------|-------|
| Facebook  | `classroom-os-vol3-facebook-1200x630.png`  | 1200 × 630  | Landscape feed / link card. |
| LinkedIn  | `classroom-os-vol3-linkedin-1200x627.png`  | 1200 × 627  | Landscape feed. |
| Instagram | `classroom-os-vol3-instagram-1080x1350.png` | 1080 × 1350 | 4:5 portrait, the tallest the feed allows. |
| TikTok    | `classroom-os-vol3-tiktok-1080x1920.png`   | 1080 × 1920 | 9:16 vertical. Content sits clear of the bottom UI rail. |

All four are on brand: Grift Black on Ink, the Rufous rule, Tuscany accents, and
the badge watermark, matching the site.

---

## Facebook

ClassroomOS is back, and Vol. III is entirely virtual.

Every classroom runs on an operating system. Most teachers inherited theirs by
accident, and it holds up fine until you are absent, exhausted, or the schedule
collapses. Vol. III is where you rebuild it on purpose, one layer at a time.

One hour every Wednesday, for nine weeks, on Google Meet, starting September 16.
The difference this time: you are teaching the whole time you build it, so you
finish with a semester of real evidence instead of a plan you hope works.

Free. Fifteen logged hours, five CUs. Crews are capped at four, so the room
stays small.

Take the seat 👉 https://luma.com/d18q3tcw

#TeacherPD #Teachers #Education #ClassroomManagement #ClassroomOS

---

## LinkedIn

There is no five-day window in a school year. So this fall, we are running
ClassroomOS as an entirely virtual cohort.

Vol. III is one hour a week on Google Meet, nine Wednesdays, starting September
16. Teachers rebuild the operating system their classroom runs on, one layer at
a time: Source Code, Architecture, Scheduler, Applications. The difference from
our summer cohorts is that participants are teaching the entire time they build,
so each piece gets handed to real students the next day and comes back with
evidence.

Fifteen hours of coursework, five CUs, logged and audit-ready with NV-SIDE.
Crews are capped at four.

It is free. Registration is open now: https://luma.com/d18q3tcw

#ProfessionalDevelopment #Education #Teachers #InstructionalDesign #EdLeadership

---

## Instagram

One hour. Every Wednesday. Nine weeks. 🧱

ClassroomOS Vol. III is an entirely virtual cohort, starting September 16. Build
the operating system your classroom runs on, one layer at a time, while you are
teaching the whole time you build it. You see it working before the quarter is
out, and you finish with a semester of evidence.

Free. Fifteen logged hours, five CUs. Crews of four, so the room stays small
enough that people know your classroom by Week 3.

Registration link in bio, or search Luma for ClassroomOS Vol. III. 🔗
.
.
#TeacherPD #Teachers #TeachersOfInstagram #Education #ClassroomManagement #TeacherLife #ClassroomOS #EdTech #BackToSchool

---

## TikTok

The system was you the whole time. ClassroomOS Vol. III, an entirely virtual
cohort, starts Sept 16. One hour every Wednesday for nine weeks, and you build
it while you teach. Free, five CUs. Link in bio. 🧱

#teachertok #teachersoftiktok #teacherlife #teacherpd #classroommanagement #education #ClassroomOS

---

## The facts, if you need to remix

- Entirely virtual cohort, on Google Meet
- Nine Wednesdays, one hour each: Sep 16, 23, 30, Oct 7, 14, 21, 28, Nov 4, 11
- Starts September 16, 2026
- Free
- Fifteen logged hours, five CUs (nine hours live, six in your own classroom)
- Audit-ready credit log with NV-SIDE
- Crews capped at four
- Leads to Vol. IV (spring, online) and Vol. V (five days in person, Las Vegas,
  Summer 2027)
- Register: https://luma.com/d18q3tcw
- Details: https://theintelligenthoodlums.com/classroom-os-volume-3

---

## Regenerating the cards

The cards are rendered from `generate-cards.mjs` (Grift fonts and the badge are
read straight from the repo and embedded, so the output is self-contained).

```
cd social/classroom-os-vol3
ln -s /opt/node22/lib/node_modules node_modules   # or: npm i playwright
node generate-cards.mjs
```

Edit the copy or the presets in that file and rerun to reflow every card.
