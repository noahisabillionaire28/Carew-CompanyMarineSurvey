/**
 * CCMS Website → Google Sheet backup
 * ------------------------------------------------------------
 * Receives the JSON the website posts to SHEETS_WEBHOOK_URL and
 * appends one row to the active sheet.
 *
 * SHEET SETUP
 * 1. Create a new Google Sheet (e.g. "CCMS Survey Requests").
 * 2. In row 1, add these headers exactly, A → K:
 *    Submitted At | Name | Company | Phone | Email | Service |
 *    Equipment Type | Location | Units | Preferred Date | Message
 *
 * DEPLOY STEPS
 * 1. In the sheet: Extensions → Apps Script.
 * 2. Delete any code there and paste this whole file. Save (Ctrl/Cmd+S).
 * 3. Click Deploy → New deployment.
 * 4. Click the gear next to "Select type" → choose "Web app".
 * 5. Description: "CCMS form backup".
 *    Execute as: Me.
 *    Who has access: Anyone.
 * 6. Click Deploy, then Authorize access and approve the permissions.
 * 7. Copy the "Web app URL" (ends in /exec).
 * 8. Paste it into Vercel as the SHEETS_WEBHOOK_URL environment variable.
 * 9. Share the sheet with Stanley (carew@ccms-survey.com) as Viewer or Editor.
 *
 * If you ever edit this script, you must Deploy → Manage deployments →
 * Edit (pencil) → Version: New version → Deploy, or the change won't go live.
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents || "{}");
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    sheet.appendRow([
      data.submittedAt || new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
      data.name || "",
      data.company || "",
      data.phone || "",
      data.email || "",
      data.service || "",
      data.equipment || "",
      data.location || "",
      data.units !== undefined && data.units !== null ? data.units : "",
      data.preferredDate || "",
      data.message || "",
    ]);

    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(
      ContentService.MimeType.JSON
    );
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: lets you open the web app URL in a browser to confirm it's live.
function doGet() {
  return ContentService.createTextOutput("CCMS form backup is running.");
}
