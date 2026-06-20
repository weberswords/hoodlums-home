/**
 * Leave Us a Message — ISTELive 26 backend
 * The Intelligent Hoodlums
 *
 * Receives JSON POSTs from /iste on theintelligenthoodlums.com and appends each
 * message as a row to a bound Google Sheet — the lightweight backing for our own
 * CRM. When someone records or uploads a message, the file is decoded and dropped
 * into a Drive folder, and the row stores a link to it.
 *
 * Same shape as the Confession Booth (for-the-record-apps-script.gs); the
 * difference is what we capture: an email (so we can write back), what brings them
 * (PD / development interest), and a newsletter opt-in — not a testimonial release.
 *
 * SETUP: see ISTE-SETUP.md. In short —
 *   1. Make a NEW Google Sheet (keep ISTE leads on their own Sheet).
 *   2. Extensions → Apps Script, paste this whole file.
 *   3. Make a Drive folder for any media, copy its ID into MEDIA_FOLDER_ID.
 *   4. Deploy → New deployment → Web app
 *        - Execute as: Me
 *        - Who has access: Anyone
 *   5. Copy the /exec URL into MSG_ENDPOINT in iste.html.
 */

// ── CONFIG ────────────────────────────────────────────────────
// Drive folder where recorded/uploaded media lands. Leave '' to use the
// script's root Drive (a folder is strongly recommended). See setup doc.
var MEDIA_FOLDER_ID = '';

// Reject payloads larger than this (decoded). The client also caps at 45 MB.
var MAX_MEDIA_BYTES = 48 * 1024 * 1024;

// Per-row consent label — the reminder, stamped on every row, that these people
// left a MESSAGE and did NOT sign a release. They're cleared for us to reply (and
// to email if newsletter = Yes) — NOT to publish. Testimonials with a signed
// release live in the separate /for-the-record sheet (for-the-record-apps-script.gs).
// If a message-leaver gives you a quote worth using, send them to /for-the-record
// to sign the release before it goes anywhere public.
var CONSENT_TYPE = 'MESSAGE — reply only; NOT a testimonial, no release on file, do NOT publish';

// Fixed column order. The header row is written automatically on first run.
var COLUMNS = [
  'received_at',          // server timestamp (added here) — the official "left at"
  'submitted_at_client',  // ISO string from the browser
  'event_name',           // context (defaults to 'ISTELive 26', ?event_name= overrides)
  'mode',                 // 'write' | 'record' | 'upload'
  'first_name',
  'last_name',
  'email',                // lowercased — the join key / CRM contact
  'role_title',
  'school_org',
  'message_text',         // the written words (may be blank for record/upload)
  'interests',            // what brings them — semicolon-joined (PD / dev / hi)
  'newsletter',           // 'Yes' | 'No' — marketing opt-in
  'media_url',            // Drive link to the recording/upload (blank for write)
  'media_filename',
  'media_type',
  'media_size',           // bytes
  'user_agent',           // browser/device string
  'page_url',
  'consent_type'          // plain-English usage rights — message vs testimonial
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000); // serialize writes so concurrent submits don't collide

    var data = {};
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return json_({ result: 'error', message: 'Bad JSON' });
    }

    // Honeypot: real users leave this empty. Bots fill it. Pretend success.
    if (data.company_website) {
      return json_({ result: 'ok' });
    }

    // We need an email to be useful as a CRM contact.
    if (!String(data.email || '').trim()) {
      return json_({ result: 'error', message: 'Missing email' });
    }

    // Need *something* to act on: words, media, an interest, or a newsletter opt-in.
    var hasText = !!String(data.message_text || '').trim();
    var hasMedia = !!data.media_base64;
    var hasIntent = !!String(data.interests || '').trim() || data.newsletter === 'Yes';
    if (!hasText && !hasMedia && !hasIntent) {
      return json_({ result: 'error', message: 'Empty message' });
    }

    // Save media to Drive, if any.
    if (hasMedia) {
      var saved = saveMedia_(data);
      if (saved.error) return json_({ result: 'error', message: saved.error });
      data.media_url = saved.url;
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    ensureHeader_(sheet);

    data.received_at = new Date();
    data.consent_type = CONSENT_TYPE;

    var row = COLUMNS.map(function (key) {
      var v = data[key];
      return (v === undefined || v === null) ? '' : v;
    });
    sheet.appendRow(row);

    return json_({ result: 'ok' });
  } catch (err) {
    return json_({ result: 'error', message: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Make sure row 1 carries every column. Columns are only ever appended to the
 * end of COLUMNS, so reconciling the header is safe for sheets that already hold
 * data: existing values keep their positions and any new trailing column just
 * gets its label.
 */
function ensureHeader_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS);
    sheet.setFrozenRows(1);
    return;
  }
  var header = sheet.getRange(1, 1, 1, COLUMNS.length).getValues()[0];
  var changed = false;
  for (var i = 0; i < COLUMNS.length; i++) {
    if (header[i] !== COLUMNS[i]) { header[i] = COLUMNS[i]; changed = true; }
  }
  if (changed) sheet.getRange(1, 1, 1, COLUMNS.length).setValues([header]);
}

/**
 * Decode the base64 media, write it to Drive, and return a shareable link.
 * The file is named after the sender so the Sheet and Drive line up.
 */
function saveMedia_(data) {
  try {
    var bytes = Utilities.base64Decode(data.media_base64);
    if (bytes.length > MAX_MEDIA_BYTES) {
      return { error: 'Media too large' };
    }

    var type = data.media_type || 'application/octet-stream';
    var who = [data.first_name, data.last_name].join(' ').trim() || 'anonymous';
    var stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd-HHmmss');
    var ext = extensionFor_(data.media_filename, type);
    var name = stamp + ' — ' + who + ext;

    var blob = Utilities.newBlob(bytes, type, name);

    var folder = MEDIA_FOLDER_ID ? DriveApp.getFolderById(MEDIA_FOLDER_ID) : DriveApp.getRootFolder();
    var file = folder.createFile(blob);

    // Anyone with the link can view — so the team can play it from the Sheet.
    // Tighten this if your messages are sensitive (see setup doc).
    try {
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (shareErr) {
      // Sharing may be restricted by org policy; the file still exists.
    }

    return { url: file.getUrl() };
  } catch (err) {
    return { error: 'Could not save media: ' + String(err) };
  }
}

function extensionFor_(filename, type) {
  // Prefer the original file's extension if it has a sane one.
  if (filename && /\.[a-z0-9]{2,5}$/i.test(filename)) {
    return filename.slice(filename.lastIndexOf('.')).toLowerCase();
  }
  var map = {
    'video/webm': '.webm', 'video/mp4': '.mp4', 'video/quicktime': '.mov',
    'audio/webm': '.webm', 'audio/mp4': '.m4a', 'audio/mpeg': '.mp3', 'audio/ogg': '.ogg',
    'image/jpeg': '.jpg', 'image/png': '.png', 'image/heic': '.heic', 'image/webp': '.webp'
  };
  var base = String(type || '').split(';')[0];
  return map[base] || '';
}

// Health check — visiting the /exec URL in a browser should say "ok".
function doGet() {
  return json_({ result: 'ok', service: 'iste-leave-a-message' });
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
