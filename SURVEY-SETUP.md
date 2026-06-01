# Classroom OS — Pulse Check Survey

A before/after survey wired into the site. It measures whether the **system
approach** (Source Code · Architecture · Scheduler · Applications) actually
relieves teachers' pain points across the week — and feeds clean rows into a
Google Sheet you can export to CSV and import into HubSpot.

- **Before** (Day 01, Mon): `https://theintelligenthoodlums.com/survey`
- **After** (Day 05, Fri): `https://theintelligenthoodlums.com/survey?phase=after`

The same two 1–5 statements appear in both phases, so `after − before` per
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

| Sheet column            | HubSpot field                                   | When     |
|-------------------------|-------------------------------------------------|----------|
| `email`                 | **Email** (the dedupe key — set as unique ID)   | both     |
| `first_name`            | **First name**                                  | both     |
| `last_name`             | **Last name**                                   | both     |
| `event_name`            | custom *Event name*                             | both     |
| `event_date`            | custom *Event date* (date)                       | both     |
| `event_type`            | custom *Event type*                             | both     |
| `event_format`          | custom *Event format*                           | both     |
| `primary_role`          | custom *Primary role (education)*               | before   |
| `years_experience`      | custom *Years experience*                       | before   |
| `school`                | Company / custom *School or District*           | before   |
| `subject_grade`         | custom *Subject & grade*                         | before   |
| `common_stressors`      | custom **multi-checkbox** *Common stressors*    | before   |
| `pain_point`            | custom *Pain point (start)*                      | before   |
| `hoped_outcome`         | custom *Hoped outcome*                           | before   |
| `value_rating`          | custom number *Value rating (1–5)*              | after    |
| `nps`                   | custom number *Recommend score (1–10)*          | after    |
| `most_valuable_takeaway`| custom *Most valuable takeaway*                 | after    |
| `what_changed`          | custom *What changed (end)*                      | after    |
| `what_built`            | custom *What they built*                         | after    |
| `work_as_model`         | custom *Use work as model?* (Yes/No)            | after    |
| `future_interest`       | custom **multi-checkbox** *Future interest*     | after    |
| `testimonial`           | custom *Testimonial*                             | after    |
| `referral_name`         | custom *Referral — name*                         | after    |
| `referral_role`         | custom *Referral — role*                         | after    |
| `referral_intro_consent`| custom *Referral — intro OK?* (Yes/No)          | after    |
| `q_runs_without_me`     | custom number (1–5) — for before→after delta      | both  |
| `q_systems_not_presence`| custom number (1–5) — for before→after delta      | both  |
| `contact_consent`       | marketing/consent status or a custom checkbox   | both     |

Because HubSpot dedupes on **email**, importing the *before* file then the
*after* file updates the **same contact** — start-of-week and end-of-week
answers live side by side. Create the custom properties first (Settings →
Properties) so the mapping is clean. Only import contacts where
`contact_consent = Yes` if you want to respect opt-in for marketing.

> **"Other" write-ins:** when someone picks *Other* on Primary role, Common
> stressors, or Future interest, a text box appears and their answer is stored
> inline as `Other: their text` in the same column (e.g.
> `future_interest = "Other: monthly check-ins"`). No extra columns to map.

> **Multi-checkbox fields** (`common_stressors`, `future_interest`) are stored
> semicolon-separated — exactly what HubSpot expects when importing into a
> multiple-checkbox property, so each selected option maps to its own value.

### Event metadata
`event_name`, `event_type`, and `event_format` are pre-filled with Classroom OS
defaults so those columns stay populated without teachers typing them. To reuse
the survey for another event, override them in the URL — e.g.
`/survey?event_name=Summer%20Institute&event_date=2026-07-10&event_format=Virtual`.
Set `event_date` per use the same way (it's blank by default).

> **Upgrade path:** when you do want real-time sync instead of CSV, the same
> payload can POST to HubSpot's CRM API (free Private App token) from a Vercel
> serverless function — no janky embedded forms, no paid Marketing tier. The
> survey page wouldn't change; only the endpoint would.

---

## What's collected

| Question | Field |
|---|---|
| My classroom could run a day without me and still work | `q_runs_without_me` |
| My classroom runs on systems and tools I've built, not my presence | `q_systems_not_presence` |

Two statements, scored 1 (not at all) → 5 (completely), kept short on purpose
to avoid survey fatigue. They appear in **both** phases, so `after − before`
per person reads directly as proof the system approach moved the needle.

**Before** also collects: first/last name, email, primary role, years
experience, subject/grade, school, common stressors (multi), biggest pain
point, and hoped outcome.

**After** also collects: value rating (1–5), recommend score (1–10), most
valuable takeaway, what changed, what they built, "use your work as a model?"
(Yes/No), who paid to attend, future interest (multi), a testimonial, and an
optional **referral** — the name and role of a principal / district leader the
teacher would point us to, plus consent to mention they referred them.

Both phases carry event metadata and contact consent.

**Required fields are kept minimal to limit fatigue** — Before asks only for
name, email, and the biggest pain point; After asks for name, email, the
value rating, the recommend score, and what changed. Everything else is
optional.

## Accessibility (WCAG 2.2 AA)
- All text/UI colors meet 1.4.3 / 1.4.11 contrast (required `*` uses Tuscany,
  8.48:1 on Ink — brand Rufous was only 2.93:1 and was not used for text).
- Radio scales and checkbox groups are real `<input>`s in `<fieldset>`/
  `<legend>` groups; the custom styling keeps a visible focus ring (1.4.11,
  2.4.7) and the native controls stay keyboard-operable (2.1.1).
- The status line is `role="status" aria-live="polite"`; validation errors
  move focus to it, and on success focus moves to the confirmation heading
  (4.1.3, 2.4.3).
- Targets (scale cells, pills, checkboxes) are ≥24px to satisfy 2.5.8 Target
  Size (Minimum).
- `prefers-reduced-motion` is respected site-wide.

## Privacy
The page is `noindex`. The honeypot field (`company_website`) silently drops
bot submissions. Only ask for what you'll use; consent is opt-in.
