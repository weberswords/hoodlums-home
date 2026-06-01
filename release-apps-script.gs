/**
 * Classroom OS — Media Release backend
 * The Intelligent Hoodlums
 *
 * Receives JSON POSTs from /release on theintelligenthoodlums.com and
 * appends each signed release as a row to a bound Google Sheet.
 *
 * SETUP: see RELEASE-SETUP.md. In short —
 *   1. Make a NEW Google Sheet (keep releases separate from Pulse Check).
 *   2. Extensions → Apps Script, paste this whole file.
 *   3. Deploy → New deployment → Web app
 *        - Execute as: Me
 *        - Who has access: Anyone
 *   4. Copy the /exec URL into RELEASE_ENDPOINT in release.html.
 *
 * Each row is a signed, timestamped record: the typed signature plus the
 * server-side receipt time and the browser's user agent stand in as the
 * evidence that this person agreed, and when.
 */

// Fixed column order. The header row is written automatically on first run.
var COLUMNS = [
  'received_at',          // server timestamp (added here) — the official "signed at"
  'submitted_at_client',  // ISO string from the browser
  'event_name',
  'event_date',
  'first_name',
  'last_name',
  'email',
  'role',                 // Teacher / Administrator-Observer / Crew-Staff / Other
  'school_org',
  'agreed',               // 'Yes' — the consent checkbox
  'typed_signature',      // full legal name typed = e-signature
  'user_agent',           // browser/device string, for record integrity
  'page_url'
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000); // serialize writes so concurrent submits don't collide

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

    // Don't record a release that wasn't actually agreed to.
    if (data.agreed !== 'Yes' || !String(data.typed_signature || '').trim()) {
      return json_({ result: 'error', message: 'Missing agreement or signature' });
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

// Health check — visiting the /exec URL in a browser should say "ok".
function doGet() {
  return json_({ result: 'ok', service: 'classroom-os-media-release' });
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
