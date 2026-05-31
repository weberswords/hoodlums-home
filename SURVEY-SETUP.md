# Classroom OS — Pulse Check Survey

A before/after survey wired into the site. It measures whether the **system
approach** (Source Code · Architecture · Scheduler · Applications) actually
relieves teachers' pain points across the week — and feeds clean rows into a
Google Sheet you can export to CSV and import into HubSpot.

- **Before** (Day 01, Mon): `https://theintelligenthoodlums.com/survey`
- **After** (Day 05, Fri): `https://theintelligenthoodlums.com/survey?phase=after`

The same five 1–5 statements appear in both phases, so `after − before` per
person reads directly as improvement. Responses are matched by **email**.

---

## One-time setup (~5 minutes)

### 1. Make the Sheet
Create a new Google Sheet (e.g. *"Classroom OS — Pulse Check Responses"*).
Leave it empty; the script writes the header row itself.

### 2. Add the script
In the Sheet: **Extensions → Apps Script**. Delete the starter code, paste the
entire contents of [`survey-apps-script.gs`](./survey-apps-script.gs), and save.

### 3. Deploy as a Web App
**Deploy → New deployment → ⚙ → Web app**
- **Description:** Classroom OS Pulse Check
- **Execute as:** *Me*
- **Who has access:** *Anyone*

Click **Deploy**, authorize when prompted, and copy the **Web app URL** — it
ends in `/exec`.

> Sanity check: paste that `/exec` URL into a browser. You should see
> `{"result":"ok","service":"classroom-os-pulse-check"}`.

### 4. Connect the site
In [`survey.html`](./survey.html), set the endpoint near the top of the
`<script>` block:

```js
var SURVEY_ENDPOINT = 'https://script.google.com/macros/s/AKfy.../exec';
```

Commit, push, let Vercel deploy. Submit one test response and confirm a row
lands in the Sheet. **Delete your test row before the event.**

> If you ever change the script, use **Deploy → Manage deployments → Edit →
> New version**. A brand-new deployment gives a new URL you'd have to paste in
> again.

---

## At the event

Make two QR codes (any free generator, or `qrencode` locally):
- **Monday:** points to `/survey`
- **Friday:** points to `/survey?phase=after`

Tell folks to use the **same email** both times so their answers match up.

---

## Exporting to HubSpot

When you're ready to load responses into HubSpot:

1. In the Sheet: **File → Download → Comma-separated values (.csv)**.
2. In HubSpot: **Contacts → Import → Start an import → File from computer →
   One file → One object (Contacts)** → upload the CSV.
3. Map the columns:

| Sheet column        | HubSpot field                                   |
|---------------------|-------------------------------------------------|
| `email`             | **Email** (the dedupe key — set as unique ID)   |
| `name`              | First/Last name (or a custom *Full name*)       |
| `role`              | custom property *Role*                          |
| `school`            | Company / custom *School or District*           |
| `subject_grade`     | custom *Subject & grade*                         |
| `pain_point`        | custom *Pain point (start)*                      |
| `hoped_outcome`     | custom *Hoped outcome*                           |
| `what_changed`      | custom *What changed (end)*                      |
| `what_built`        | custom *What they built*                         |
| `nps`               | custom *NPS*                                      |
| `testimonial`       | custom *Testimonial*                             |
| `q_*` (the five)    | custom number properties (optional, for deltas) |
| `contact_consent`   | marketing/consent status or a custom checkbox   |

Because HubSpot dedupes on **email**, importing the *before* file then the
*after* file updates the **same contact** — start-of-week and end-of-week
answers live side by side. Create the custom properties first (Settings →
Properties) so the mapping is clean. Only import contacts where
`contact_consent = Yes` if you want to respect opt-in for marketing.

> **Upgrade path:** when you do want real-time sync instead of CSV, the same
> payload can POST to HubSpot's CRM API (free Private App token) from a Vercel
> serverless function — no janky embedded forms, no paid Marketing tier. The
> survey page wouldn't change; only the endpoint would.

---

## What's collected

| Question | Layer | Field |
|---|---|---|
| Can articulate beliefs about how students learn | Source Code | `q_source_code` |
| Classroom runs on structures, not my presence | Architecture | `q_architecture` |
| Year designed as an arc, not a pacing guide | Scheduler | `q_scheduler` |
| Tools/systems run when I'm not in the room | Applications | `q_applications` |
| Classroom could run a day without me | Whole system | `q_north_star` |

All scored 1 (not at all) → 5 (completely). Plus name, email, role, school,
subject/grade, the open pain-point / outcome questions, NPS + testimonial
(after), and contact consent.

## Privacy
The page is `noindex`. The honeypot field (`company_website`) silently drops
bot submissions. Only ask for what you'll use; consent is opt-in.
