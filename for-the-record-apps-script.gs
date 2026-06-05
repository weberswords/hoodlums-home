/**
 * The Confession Booth — testimonial backend
 * The Intelligent Hoodlums
 *
 * Receives JSON POSTs from /for-the-record on theintelligenthoodlums.com and
 * appends each testimonial as a row to a bound Google Sheet. When a person
 * records or uploads media, the file is decoded and dropped into a Drive
 * folder, and the row stores a link to it.
 *
 * SETUP: see FOR-THE-RECORD-SETUP.md. In short —
 *   1. Make a NEW Google Sheet (keep testimonials on their own Sheet).
 *   2. Extensions → Apps Script, paste this whole file.
 *   3. Make a Drive folder for the media, copy its ID into MEDIA_FOLDER_ID.
 *   4. Deploy → New deployment → Web app
 *        - Execute as: Me
 *        - Who has access: Anyone
 *   5. Copy the /exec URL into BOOTH_ENDPOINT in for-the-record.html.
 *
 * Each row is a signed, timestamped testimonial: the typed signature plus the
 * server-side receipt time and the browser's user agent are the evidence that
 * this person agreed to let us share it, and when.
 */

// ── CONFIG ────────────────────────────────────────────────────
// Drive folder where recorded/uploaded media lands. Leave '' to use the
// script's root Drive (a folder is strongly recommended). See setup doc.
var MEDIA_FOLDER_ID = '1xXB1U1810GTMYFOvpXR3nXdMHqD5JN_o';

// Reject payloads larger than this (decoded). The client also caps at 45 MB.
var MAX_MEDIA_BYTES = 48 * 1024 * 1024;

// Fixed column order. The header row is written automatically on first run.
var COLUMNS = [
  'received_at',          // server timestamp (added here) — the official "left at"
  'submitted_at_client',  // ISO string from the browser
  'mode',                 // 'write' | 'record' | 'upload'
  'event_name',           // optional context (?event_name=)
  'first_name',
  'last_name',
  'role_title',
  'school_org',
  'email',
  'testimonial_text',     // the written words (may be blank for record/upload)
  'media_url',            // Drive link to the recording/upload (blank for write)
  'media_filename',
  'media_type',
  'media_size',           // bytes
  'agreed',               // 'Yes' — the consent checkbox
  'typed_signature',      // full name typed = e-signature
  'user_agent',           // browser/device string, for record integrity
  'page_url'
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

    // Don't record a testimonial that wasn't actually agreed to / signed.
    if (data.agreed !== 'Yes' || !String(data.typed_signature || '').trim()) {
      return json_({ result: 'error', message: 'Missing agreement or signature' });
    }

    // Need *something* to record: words or media.
    var hasText = !!String(data.testimonial_text || '').trim();
    var hasMedia = !!data.media_base64;
    if (!hasText && !hasMedia) {
      return json_({ result: 'error', message: 'Empty testimonial' });
    }

    // Save media to Drive, if any.
    if (hasMedia) {
      var saved = saveMedia_(data);
      if (saved.error) return json_({ result: 'error', message: saved.error });
      data.media_url = saved.url;
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(COLUMNS);
      sheet.setFrozenRows(1);
    }

    data.received_at = new Date();

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
 * Decode the base64 media, write it to Drive, and return a shareable link.
 * The file is named after the signer so the Sheet and Drive line up.
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
    // Tighten this if your testimonials are sensitive (see setup doc).
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
  return json_({ result: 'ok', service: 'for-the-record-testimonials' });
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
