/**
 * Classroom OS — Pulse Check survey backend
 * The Intelligent Hoodlums
 *
 * Receives JSON POSTs from /survey on theintelligenthoodlums.com and
 * appends each response as a row to the bound Google Sheet.
 *
 * SETUP: see SURVEY-SETUP.md. In short —
 *   1. Make a Google Sheet.
 *   2. Extensions → Apps Script, paste this whole file.
 *   3. Deploy → New deployment → Web app
 *        - Execute as: Me
 *        - Who has access: Anyone
 *   4. Copy the /exec URL into SURVEY_ENDPOINT in survey.html.
 *
 * Columns are fixed (COLUMNS below) so the export stays stable and
 * before/after rows line up. The Likert questions are scored 1–5,
 * higher = better, so an after-minus-before delta reads as improvement.
 */

// Fixed column order. The header row is written automatically on first run.
var COLUMNS = [
  'received_at',          // server timestamp (added here)
  'phase',                // 'before' | 'after'
  'submitted_at_client',  // ISO string from the browser
  'name',
  'email',                // lowercased — the join key between before & after
  'role',
  'subject_grade',
  'school',
  'q_source_code',        // Likert 1–5
  'q_architecture',       // Likert 1–5
  'q_scheduler',          // Likert 1–5
  'q_applications',       // Likert 1–5
  'q_north_star',         // Likert 1–5
  'pain_point',           // before
  'hoped_outcome',        // before
  'what_changed',         // after
  'what_built',           // after
  'nps',                  // after, 0–10
  'testimonial',          // after
  'contact_consent'       // 'Yes' | 'No'  → HubSpot consent / marketing status
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

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Write the header row once.
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
  return json_({ result: 'ok', service: 'classroom-os-pulse-check' });
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
