# Media Release — Setup

A digital media release at `/release`. People sign on their phone (or at the door via
QR), and each signed release lands as a row in a Google Sheet. No printing, no paper.

It works exactly like the [Pulse Check](./SURVEY-SETUP.md) — a static HTML form that
POSTs JSON to a Google Apps Script web app. **Keep it on its own Sheet and its own
deployment** so consent records stay separate from survey data.

## 1. Make the Sheet + deploy the script

1. Create a **new** Google Sheet (e.g. "Classroom OS — Media Releases").
2. **Extensions → Apps Script**. Delete the stub and paste all of
   [`release-apps-script.gs`](./release-apps-script.gs).
3. **Deploy → New deployment → Web app**
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Authorize when prompted. Copy the **`/exec` URL**.

## 2. Wire up the form

Open [`release.html`](./release.html) and paste the URL into:

```js
var RELEASE_ENDPOINT = ''; // ← your https://script.google.com/macros/s/…/exec
```

Health check: visiting the `/exec` URL in a browser should return
`{"result":"ok","service":"classroom-os-media-release"}`.

## 3. Collect signatures

Share the link or drop a QR code to **`/release`** at the check-in table. You can
pre-fill the date: `/release?event_date=2026-06-01`.

Each row records: server receipt time (the official "signed at"), the typed signature,
name, email, role, school, the device's user agent, and the agreement flag — a
timestamped electronic-signature record. Only rows where the box was checked **and** a
signature was typed are written.

## Notes

- **18+ only.** The release states the signer is an adult. Don't film identifiable
  minors without separate parent/guardian + district consent.
- **Withdrawal:** signers can revoke *future* use by emailing
  `whenindoubt@theintelligenthoodlums.com`. Note it in the sheet when they do.
- This is a standard media release, not legal advice. Have counsel review before a
  large public campaign if you want to be airtight.

---

*When in doubt, trust a Hoodlum.*
