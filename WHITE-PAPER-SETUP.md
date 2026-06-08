# White Paper Gate — Setup

The white paper is gated behind our own mini-CRM. A prospect fills out a short form at
`/white-paper-request`; their details land as a row in a Google Sheet, the page reveals
the paper, and the script emails them the link so it's easy to forward to their team.

It works exactly like [Media Release](./RELEASE-SETUP.md) and [Pulse Check](./SURVEY-SETUP.md)
— a static HTML form that POSTs JSON to a Google Apps Script web app. **Keep it on its own
Sheet and its own deployment** so leads stay separate from consent and survey data.

The funnel: `/classroom-os` (public appetizer) → **"Get the White Paper"** → `/white-paper-request`
(this gate) → `/white-paper` (the gated meal).

## 1. Make the Sheet + deploy the script

1. Create a **new** Google Sheet (e.g. "Classroom OS — White Paper CRM").
2. **Extensions → Apps Script**. Delete the stub and paste all of
   [`white-paper-apps-script.gs`](./white-paper-apps-script.gs).
3. Edit the **`CONFIG`** block at the top:
   - `PAPER_URL` — the live URL of the paper (default `https://theintelligenthoodlums.com/white-paper`).
   - `PDF_URL` — leave empty for now; fill it once a hosted PDF exists (see §4).
4. **Deploy → New deployment → Web app**
   - **Execute as:** Me
   - **Who has access:** Anyone
5. Authorize when prompted — the first send asks for the Gmail/Send scope. Copy the **`/exec` URL`**.

## 2. Wire up the form

Open [`white-paper-request.html`](./white-paper-request.html) and paste the URL into:

```js
var WP_ENDPOINT = ''; // ← your https://script.google.com/macros/s/…/exec
```

Health check: visiting the `/exec` URL in a browser should return
`{"result":"ok","service":"classroom-os-white-paper-gate"}`.

## 3. What gets captured / delivered

Each row records: server receipt time, the browser timestamp, first/last name, email,
role, school/district, the source CTA, whether the delivery email sent, the device's user
agent, and the page URL. The honeypot silently drops bots.

On success the page reveals a **Read the White Paper** button and tells the visitor the
link was emailed. The email is sent from your Google account (display name set by
`FROM_NAME`, replies routed to `REPLY_TO`). Free Google accounts can send ~100/day.

## 4. (Later) light up Download + Save to Drive

The web page is the canonical paper. To also offer a **downloadable / Save-to-Drive PDF**:

1. Export the paper to a print-ready PDF (a print stylesheet for `/white-paper` is the
   planned source — "Save as PDF").
2. Host it at a **public** URL (e.g. `/assets/Classroom-OS-White-Paper.pdf`).
3. Put that URL in **two** places:
   - `PDF_URL` in `white-paper-apps-script.gs` (adds a PDF line to the email), and
   - `PDF_URL` in `white-paper-request.html` (reveals the **Download the PDF** button and
     the Google **Save to Drive** widget on the success screen).

Until `PDF_URL` is set, only the **Read the White Paper** button shows — no dead buttons.

## Notes

- `/white-paper` and `/white-paper-request` are both `noindex`. The gate is a soft gate:
  the paper lives at a stable URL revealed on submit and by email, not behind auth. That
  matches the rest of the site and is the right level of friction for lead capture.
- `.vercelignore` keeps `*.gs` and `*.md` out of the public deploy; the two HTML pages
  ship. Don't commit the CRM Sheet or any exported leads to the repo (PII).

---

*When in doubt, trust a Hoodlum.*
