# The Confession Booth — Setup

An **unlisted** testimonial page at `/confession`. It isn't linked from the main site —
you point people to it (a link, a QR code at an event, a card). Visitors can leave a
testimonial three ways: **write it**, **record it** in the browser, or **upload** a file
they already have. Every testimonial is signed with a short release so you're cleared to
use it publicly.

It works like [`/release`](./RELEASE-SETUP.md) and [`/survey`](./SURVEY-SETUP.md) — a
static HTML page that POSTs JSON to a Google Apps Script web app. The difference: recorded
and uploaded media is decoded and saved to a **Google Drive folder**, and the Sheet row
stores a link to it.

> **Keep it on its own Sheet and its own deployment** so testimonials stay separate from
> survey and release data.

## 1. Make the Sheet + the media folder

1. Create a **new** Google Sheet (e.g. "Confession Booth — Testimonials").
2. In Google Drive, create a **folder** for the media (e.g. "Booth — Media"). Open it and
   copy the folder ID from the URL: `drive.google.com/drive/folders/`**`<THIS_PART>`**.

## 2. Deploy the script

1. In the Sheet: **Extensions → Apps Script**. Delete the stub and paste all of
   [`confession-apps-script.gs`](./confession-apps-script.gs).
2. At the top, set the folder ID:
   ```js
   var MEDIA_FOLDER_ID = 'paste-the-folder-id-here';
   ```
   (Leave it `''` and media lands in your Drive root — a folder is strongly recommended.)
3. **Deploy → New deployment → Web app**
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Authorize when prompted. Because the script writes files, it will ask for **Drive**
   permission as well as Sheets — that's expected. Copy the **`/exec` URL**.

Health check: visiting the `/exec` URL in a browser should return
`{"result":"ok","service":"confession-booth-testimonials"}`.

## 3. Wire up the page

Open [`confession.html`](./confession.html) and paste the URL into:

```js
var BOOTH_ENDPOINT = ''; // ← your https://script.google.com/macros/s/…/exec
```

## 4. Point people to it

Share the link or print a QR code to **`/confession`**. You can tag the context so it lands
in the Sheet: `/confession?event_name=Classroom%20OS`.

Each row records: server receipt time, the mode (write / record / upload), name, role,
school, optional email, the written words, a **Drive link** to any recording or upload, the
typed signature, the device's user agent, and the agreement flag — a timestamped, signed
testimonial record. Only rows where the box was checked **and** a name was signed are saved.

## How recording & upload work

- **Record** uses the browser's `MediaRecorder` — a live camera/mic preview, up to **90
  seconds**, with re-record and a "save a copy" button. There's an **audio-only** toggle for
  people who don't want to be on camera. Nothing leaves the device until they hit submit.
- **Upload** accepts video, audio, or an image, **up to 45 MB**. Bigger files are rejected
  client-side with a prompt to email instead — Apps Script can't accept arbitrarily large
  POSTs (the body cap is ~50 MB, and base64 inflates a file by ~33%).
- The page degrades gracefully: if a browser can't record in-page (rare), the Record button
  is disabled and the visitor is steered to Write or Upload.

## Notes

- **18+ only.** The release states the signer is an adult. Don't publish identifiable minors
  without separate parent/guardian consent.
- **Withdrawal:** people can revoke *future* use by emailing
  `whenindoubt@theintelligenthoodlums.com`. Note it in the Sheet when they do.
- **Sharing:** saved media is set to *anyone with the link can view* so the team can play it
  straight from the Sheet. If your testimonials are sensitive, change the `setSharing` call
  in the script to keep files private and grant access per-person.
- This is a standard testimonial release, not legal advice. Have counsel review before a
  large public campaign if you want to be airtight.

---

*When in doubt, trust a Hoodlum.*
