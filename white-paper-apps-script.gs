/**
 * Classroom OS — White Paper gate backend (our own mini-CRM)
 * The Intelligent Hoodlums
 *
 * Receives JSON POSTs from /white-paper-request on theintelligenthoodlums.com,
 * appends each lead as a row to a bound Google Sheet, and emails the requester
 * the link to the white paper.
 *
 * SETUP: see WHITE-PAPER-SETUP.md. In short —
 *   1. Make a NEW Google Sheet ("Classroom OS — White Paper CRM").
 *   2. Extensions → Apps Script, paste this whole file.
 *   3. Edit the CONFIG block below (paper URL, optional PDF URL, from-name).
 *   4. Deploy → New deployment → Web app
 *        - Execute as: Me
 *        - Who has access: Anyone
 *   5. Copy the /exec URL into WP_ENDPOINT in white-paper-request.html.
 *
 * Note: the first time the script sends mail it will ask you to authorize the
 * Gmail/Send scope. Daily send quota on a free Google account is ~100 emails.
 */

// ── CONFIG ────────────────────────────────────────────────────
var CONFIG = {
  PAPER_URL: 'https://theintelligenthoodlums.com/white-paper',
  PDF_URL: '',                       // optional: public link to the hosted PDF
  FROM_NAME: 'The Intelligent Hoodlums',
  REPLY_TO: 'whenindoubt@theintelligenthoodlums.com',
  SUBJECT: 'Your Classroom OS white paper'
};

// Fixed column order. The header row is written automatically on first run.
var COLUMNS = [
  'received_at',          // server timestamp (added here)
  'submitted_at_client',  // ISO string from the browser
  'first_name',
  'last_name',
  'email',
  'role',
  'school_org',
  'source',               // which page/CTA sent them
  'emailed',              // 'Yes' / 'No' — did the delivery email send
  'user_agent',
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

    // Minimum viable lead: a name and a valid-looking email.
    var email = String(data.email || '').trim().toLowerCase();
    if (!String(data.first_name || '').trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json_({ result: 'error', message: 'Missing name or valid email' });
    }
    data.email = email;

    // Send the paper. Don't fail the whole request if mail hiccups —
    // the lead is still captured, and the page reveals the link anyway.
    var emailed = 'No';
    try {
      sendPaper_(data);
      emailed = 'Yes';
    } catch (mailErr) {
      emailed = 'No';
    }
    data.emailed = emailed;

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

    return json_({ result: 'ok', emailed: emailed });
  } catch (err) {
    return json_({ result: 'error', message: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function sendPaper_(data) {
  var first = String(data.first_name || '').trim();
  var paper = CONFIG.PAPER_URL;
  var pdfLine = CONFIG.PDF_URL
    ? '\n\nPrefer a PDF to forward or print? ' + CONFIG.PDF_URL
    : '';

  var text =
    'Hi ' + first + ',\n\n' +
    'Here\'s the Classroom OS white paper:\n' + paper + pdfLine + '\n\n' +
    'It goes past the story to the architecture, the research it stands on, the full ' +
    'Pulse Check methodology with the Monday-to-Friday data, and the case study in full.\n\n' +
    'Reply to this email if you\'d like to talk about bringing it to your school or district — ' +
    'we read every one.\n\n' +
    '— The Intelligent Hoodlums\n' +
    'Las Vegas · Est 2014';

  var html =
    '<p>Hi ' + escapeHtml_(first) + ',</p>' +
    '<p>Here\'s the Classroom OS white paper:</p>' +
    '<p><a href="' + paper + '">' + paper + '</a></p>' +
    (CONFIG.PDF_URL ? '<p>Prefer a PDF to forward or print? <a href="' + CONFIG.PDF_URL + '">Download it here</a>.</p>' : '') +
    '<p>It goes past the story to the architecture, the research it stands on, the full ' +
    'Pulse Check methodology with the Monday-to-Friday data, and the case study in full.</p>' +
    '<p>Reply to this email if you\'d like to talk about bringing it to your school or district — ' +
    'we read every one.</p>' +
    '<p>&mdash; The Intelligent Hoodlums<br>Las Vegas &middot; Est 2014</p>';

  MailApp.sendEmail({
    to: data.email,
    subject: CONFIG.SUBJECT,
    name: CONFIG.FROM_NAME,
    replyTo: CONFIG.REPLY_TO,
    body: text,
    htmlBody: html
  });
}

function escapeHtml_(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

// Health check — visiting the /exec URL in a browser should say "ok".
function doGet() {
  return json_({ result: 'ok', service: 'classroom-os-white-paper-gate' });
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
