/**
 * The Intelligent Hoodlums — CRM intake
 * (formerly the Confession Booth backend; now serves both doors)
 *
 * One Apps Script web app, one bound Google Sheet: the start of our custom CRM.
 * Every potential contact lands in this one sheet, whatever door they came through:
 *
 *   - /for-the-record  (the Confession Booth) → signed TESTIMONIALS
 *   - /iste            (Leave us a message)   → reply-only MESSAGES
 *
 * Each page tells us which with a `form_type` field ('testimonial' | 'message');
 * if it's missing we assume 'testimonial' (the original booth behavior). Both kinds
 * share this sheet so we have a single contact list to work from — the `form_type`
 * and `consent_type` columns keep them unmistakably distinct, so a reply-only
 * message never gets treated as a publishable testimonial. Filter on either column
 * to slice the list.
 *
 * Recorded / uploaded media (either door) is decoded and dropped into a Drive
 * folder, and the row stores a link to it.
 *
 * SETUP: see FOR-THE-RECORD-SETUP.md. Both pages point at THIS one /exec URL.
 * After editing this script, redeploy: Deploy → Manage deployments → (edit) →
 * New version → Deploy. The /exec URL stays the same.
 */

// ── CONFIG ────────────────────────────────────────────────────
// Drive folder where recorded/uploaded media lands. Leave '' to use the
// script's root Drive (a folder is strongly recommended). See setup doc.
var MEDIA_FOLDER_ID = '1xXB1U1810GTMYFOvpXR3nXdMHqD5JN_o';

// Reject payloads larger than this (decoded). The client also caps at 45 MB.
var MAX_MEDIA_BYTES = 48 * 1024 * 1024;

// Per-row consent label by door — stamped on every row. The reminder, carried by
// the data itself, that testimonials are cleared to publish and messages are not.
var CONSENT_TYPES = {
  testimonial: 'TESTIMONIAL — signed release on file; OK to publish per release terms',
  message: 'MESSAGE — reply only; NOT a testimonial, no release on file, do NOT publish'
};

// Fixed column order. Columns are only ever APPENDED here (never reordered or
// inserted) so ensureHeader_ can safely migrate a sheet that already holds data:
// existing rows keep their positions and new trailing columns just get labeled.
// Don't hand-reorder columns in the Sheet — use a filter view or freeze instead.
var COLUMNS = [
  'received_at',          // server timestamp (added here) — the official "left at"
  'submitted_at_client',  // ISO string from the browser
  'mode',                 // 'write' | 'record' | 'upload'
  'event_name',           // optional context (?event_name=)
  'first_name',
  'last_name',
  'role_title',
  'school_org',
  'email',                // lowercased — the CRM contact / join key
  'testimonial_text',     // booth: the written testimonial (blank for messages)
  'media_url',            // Drive link to any recording/upload
  'media_filename',
  'media_type',
  'media_size',           // bytes
  'agreed',               // booth: 'Yes' consent checkbox (blank for messages)
  'typed_signature',      // booth: full name typed = e-signature (blank for messages)
  'user_agent',           // browser/device string
  'page_url',
  // ── appended over time (keep appending; never reorder the above) ──
  'consent_type',         // plain-English usage rights — testimonial vs message
  'form_type',            // 'testimonial' | 'message' — which door they came through
  'message_text',         // iste: the written message (blank for testimonials)
  'interests',            // iste: what brings them — semicolon-joined (PD / dev / hi)
  'newsletter'            // iste: 'Yes' | 'No' — marketing opt-in
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

    // Which door? Default to testimonial so the original booth keeps working even
    // if an older page doesn't send form_type.
    var formType = (data.form_type === 'message') ? 'message' : 'testimonial';
    var hasMedia = !!data.media_base64;

    if (formType === 'testimonial') {
      // Don't record a testimonial that wasn't actually agreed to / signed.
      if (data.agreed !== 'Yes' || !String(data.typed_signature || '').trim()) {
        return json_({ result: 'error', message: 'Missing agreement or signature' });
      }
      // Need *something* to record: words or media.
      if (!String(data.testimonial_text || '').trim() && !hasMedia) {
        return json_({ result: 'error', message: 'Empty testimonial' });
      }
    } else {
      // A message needs an email to be useful as a CRM contact.
      if (!String(data.email || '').trim()) {
        return json_({ result: 'error', message: 'Missing email' });
      }
      // Need something to act on: words, media, an interest, or a newsletter opt-in.
      var hasMsg = !!String(data.message_text || '').trim();
      var hasIntent = !!String(data.interests || '').trim() || data.newsletter === 'Yes';
      if (!hasMsg && !hasMedia && !hasIntent) {
        return json_({ result: 'error', message: 'Empty message' });
      }
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
    data.form_type = formType;
    data.consent_type = CONSENT_TYPES[formType];

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
 * Make sure row 1 carries every column. Columns are only ever appended to the end
 * of COLUMNS, so reconciling the header is safe for sheets that already hold data:
 * existing values keep their positions and any new trailing column just gets its
 * label. (This is how consent_type / form_type / message fields land on the live
 * booth sheet without disturbing existing testimonials.)
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
    // Tighten this if your media is sensitive (see setup doc).
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
  return json_({ result: 'ok', service: 'tih-crm-intake' });
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
