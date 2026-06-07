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
  'marketing_opt_in',     // 'Yes' / 'No' — consent to marketing emails
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

  var pdfText = CONFIG.PDF_URL ? '\n\nPrefer a PDF to forward or print? ' + CONFIG.PDF_URL : '';
  var pdfHtml = CONFIG.PDF_URL
    ? '<p style="margin:0 0 22px;">Prefer a PDF to forward or print? <a href="' + CONFIG.PDF_URL + '" style="color:#B7280F;font-weight:700;">Download it here</a>.</p>'
    : '';

  var text =
    'Hi ' + first + ',\n\n' +
    'Here\'s the Classroom OS white paper. The big idea in one line: the biggest lever you have ' +
    'on learner achievement is the teacher in the room, and this is how you invest in it.\n\n' +
    'Read it here:\n' + paper + pdfText + '\n\n' +
    'Inside is the method, the research behind it, and the data from our June pilot. Forward it ' +
    'to your team. If you want to talk about bringing it to your school or district, just reply. ' +
    'We read every one.\n\n' +
    'When in doubt, trust a Hoodlum.\n\n' +
    'Mike & Webs\n' +
    'The Intelligent Hoodlums · Las Vegas · Est 2014';

  var f = escapeHtml_(first);
  var html =
    '<div style="background:#0F1419;padding:24px 16px;font-family:\'Helvetica Neue\',Arial,sans-serif;">' +
      '<div style="max-width:560px;margin:0 auto;background:#F2E8D5;">' +
        '<div style="background:#0F1419;padding:18px 28px;border-bottom:2px solid #B7280F;">' +
          '<div style="color:#F2E8D5;font-size:15px;letter-spacing:3px;font-weight:700;">THE INTELLIGENT HOODLUMS</div>' +
          '<div style="color:#8CA3B5;font-size:11px;letter-spacing:2px;margin-top:5px;">LAS VEGAS &middot; EST 2014</div>' +
        '</div>' +
        '<div style="padding:28px;color:#0F1419;font-size:16px;line-height:1.6;">' +
          '<p style="margin:0 0 16px;">Hi ' + f + ',</p>' +
          '<p style="margin:0 0 16px;">Here\'s the Classroom OS white paper. The big idea in one line: the biggest lever you have on learner achievement is the teacher in the room, and this is how you invest in it.</p>' +
          '<p style="margin:0 0 24px;">Inside is the method, the research behind it, and the data from our June pilot.</p>' +
          '<p style="margin:0 0 24px;"><a href="' + paper + '" style="display:inline-block;background:#B7280F;color:#F2E8D5;text-decoration:none;font-weight:700;letter-spacing:1px;padding:13px 26px;">READ THE WHITE PAPER</a></p>' +
          pdfHtml +
          '<p style="margin:0 0 16px;">Forward it to your team. If you want to talk about bringing it to your school or district, just reply. We read every one.</p>' +
          '<p style="margin:24px 0 4px;font-weight:700;">When in doubt, trust a Hoodlum.</p>' +
          '<p style="margin:0;color:#0B2545;">Mike &amp; Webs<br><span style="color:#0F1419;">The Intelligent Hoodlums</span></p>' +
        '</div>' +
        '<div style="height:6px;background:#B7280F;"></div>' +
      '</div>' +
    '</div>';

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
