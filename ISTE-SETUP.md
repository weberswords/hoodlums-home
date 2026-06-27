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
2. **Email capture → the CRM sheet** — every message lands as a row (name, email,
   role, school).
3. **What brings you + newsletter** — structured interest checkboxes (on-site PD,
   virtual PD, custom development, just saying hi) and a newsletter opt-in.

## It shares ONE backend with the booth — there's nothing new to deploy

`/iste` and `/for-the-record` post to the **same** Apps Script web app and land in
the **same** Google Sheet — the start of our custom CRM, one list of every potential
contact. The page is already wired to that endpoint (`MSG_ENDPOINT` in
[`iste.html`](./iste.html) holds the booth's `/exec` URL). It tags its rows
`form_type = 'message'`; the booth tags `form_type = 'testimonial'`.

So to turn `/iste` on, you don't deploy anything new — you just **update and redeploy
the one shared script** so it knows how to handle messages:

1. Open the CRM Sheet → **Extensions → Apps Script**.
2. Paste the latest [`for-the-record-apps-script.gs`](./for-the-record-apps-script.gs)
   (it now routes both testimonials and messages).
3. **Deploy → Manage deployments → (edit the existing web app) → New version → Deploy.**
   The `/exec` URL stays the same, so both pages keep working — no URL to change.

That's it. See [FOR-THE-RECORD-SETUP.md](./FOR-THE-RECORD-SETUP.md) for the full
backend reference.

## Messages are not testimonials (same sheet, still distinct)

Everyone lands in one sheet, but two columns keep the consent line bright:

- **`form_type`** — `message` vs `testimonial`.
- **`consent_type`** — for messages it reads
  *MESSAGE — reply only; NOT a testimonial, do NOT publish*; for testimonials,
  *TESTIMONIAL — signed release on file; OK to publish*.

Filter or sort on either before you publish anything. A message is consent to
**reply**, not to market or quote — only the **`newsletter` = Yes** rows opted into
mail, and only **testimonial** rows are cleared to publish. If a message-leaver gives
you a quote worth using, send them to `/for-the-record` to sign the release first.

## A note on ISTE's rules

The session itself can't be a sales pitch and you can't solicit inside it — but this
page is on **our** site, so the PD/booking calls to action live here, not in the
session. In the room: teach, then say "leave us a message at the link." Everything
commercial happens one compliant step later, on our turf.

---

*When in doubt, trust a Hoodlum.*
