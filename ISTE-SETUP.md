# Leave Us a Message (ISTELive 26) — Setup

The session landing page at **`/iste`** for our virtual Idea Lab,
*Human-Centered AI Collaboration for Beginners*. It's public and linkable — point
attendees to it from the slides, the session chat, and a short URL
(`theintelligenthoodlums.com/iste`).

The page does three jobs on our own turf (so it stays clear of ISTE's in-session
no-promotion rules):

1. **Leave us a message** — the confession-booth component, repurposed. Visitors
   **write**, **record** (in-browser, up to 2 min), or **upload** a message. No
   testimonial release — it's a note, not a publicity grant.
2. **Email capture → Google Sheet** — every message lands as a row in a Sheet, the
   lightweight backing for our own CRM (name, email, role, school).
3. **What brings you + newsletter** — structured interest checkboxes (on-site PD,
   virtual PD, custom development, just saying hi) and a newsletter opt-in, so the
   right Hoodlum can follow up and we honor marketing consent.

It works like [`/for-the-record`](./FOR-THE-RECORD-SETUP.md) and
[`/survey`](./SURVEY-SETUP.md) — a static HTML page that POSTs JSON to a Google
Apps Script web app, with recorded/uploaded media decoded to a **Drive folder**.

> **Keep it on its own Sheet and its own deployment** so ISTE leads stay separate
> from testimonial and survey data.

## 1. Make the Sheet + the media folder

1. Create a **new** Google Sheet (e.g. "ISTE 26 — Leave a Message").
2. In Google Drive, create a **folder** for any media (e.g. "ISTE — Media"). Open it
   and copy the folder ID from the URL:
   `drive.google.com/drive/folders/`**`<THIS_PART>`**.

## 2. Deploy the script

1. In the Sheet: **Extensions → Apps Script**. Delete the stub and paste all of
   [`iste-apps-script.gs`](./iste-apps-script.gs).
2. At the top, set the folder ID:
   ```js
   var MEDIA_FOLDER_ID = 'paste-the-folder-id-here';
   ```
   (Leave it `''` and media lands in your Drive root — a folder is recommended.)
3. **Deploy → New deployment → Web app**
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Authorize when prompted. Because the script writes files, it asks for **Drive**
   permission as well as Sheets — that's expected. Copy the **`/exec` URL**.

Health check: visiting the `/exec` URL in a browser should return
`{"result":"ok","service":"iste-leave-a-message"}`.

## 3. Wire up the page

Open [`iste.html`](./iste.html) and paste the URL into:

```js
var MSG_ENDPOINT = ''; // ← your https://script.google.com/macros/s/…/exec
```

Until this is set, the form validates but tells the visitor it isn't wired up yet.

## 4. Point people to it

Share **`/iste`** — say it out loud in the session, drop it in the session chat, and
put it on the closing slide. You can tag context so it lands in the Sheet:
`/iste?event_name=ISTELive%2026%20Idea%20Lab`.

Each row records: server receipt time, the mode (write / record / upload), name,
email, role, school, the written message, a **Drive link** to any recording/upload,
what brings them, the newsletter opt-in, and the device's user agent — a timestamped
CRM contact. Only rows with an email **and** something to act on (a message, media,
an interest, or a newsletter opt-in) are saved.

## A note on ISTE's rules

The session itself can't be a sales pitch and you can't solicit inside it — but this
page is on **our** site, so the PD/booking calls to action live here, not in the
session. In the room: teach, then say "leave us a message at the link." Everything
commercial happens one compliant step later, on our turf. (See the conference's
presenter and exhibitor policies for the current wording.)

## Notes

- **Newsletter consent** is the `newsletter` column (`Yes`/`No`) — only mail people
  who opted in. Leaving a message is consent to *reply*, not to market.
- **Sharing:** saved media is set to *anyone with the link can view* so the team can
  play it from the Sheet. Tighten the `setSharing` call in the script if needed.
- **Upload cap:** 45 MB client-side (Apps Script's POST body caps near 50 MB and
  base64 inflates a file ~33%). Bigger files are bounced to email.

---

*When in doubt, trust a Hoodlum.*
