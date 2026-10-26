import type { RequestData } from "@/lib/schema";
import { site } from "@/data/site";

const NAVY = "#0B1F3A";
const TEXT = "#1E293B";
const MUTED = "#64748B";
const BORDER = "#DCE8F3";
const LIGHT = "#E9F4FC";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function summaryRows(data: RequestData, submittedAt: string): [string, string][] {
  return [
    ["Submitted", submittedAt],
    ["Name", data.name],
    ["Company", data.company],
    ["Phone", data.phone],
    ["Email", data.email],
    ["Service", data.service],
    ["Equipment", data.equipment],
    ["Location", data.location],
    ["Units", data.units !== undefined ? String(data.units) : "—"],
    ["Preferred date", data.preferredDate || "—"],
    ["Message", data.message || "—"],
  ];
}

function table(rows: [string, string][]) {
  const tr = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:10px 14px;border:1px solid ${BORDER};background:${LIGHT};font-weight:600;color:${NAVY};white-space:nowrap;font-size:14px">${k}</td><td style="padding:10px 14px;border:1px solid ${BORDER};color:${TEXT};font-size:14px">${escapeHtml(v).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("");
  return `<table cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%">${tr}</table>`;
}

function shell(title: string, body: string) {
  return `<!doctype html><html><body style="margin:0;padding:24px;background:#F5F9FD;font-family:Arial,Helvetica,sans-serif;color:${TEXT};line-height:1.5">
<div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid ${BORDER};border-radius:12px;overflow:hidden">
  <div style="background:${NAVY};padding:20px 24px;color:#ffffff">
    <div style="font-size:20px;font-weight:700;letter-spacing:-0.01em">CCMS</div>
    <div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#BFDFF5;margin-top:2px">Carew &amp; Company Marine Survey</div>
  </div>
  <div style="padding:24px">
    <h1 style="margin:0 0 16px;font-size:22px;color:${NAVY}">${title}</h1>
    ${body}
  </div>
  <div style="padding:16px 24px;border-top:1px solid ${BORDER};font-size:12px;color:${MUTED}">
    ${site.name} · ${site.phone} · ${site.email}<br>
    ${site.streetAddress.line1}, ${site.streetAddress.city}, ${site.streetAddress.state} ${site.streetAddress.zip} · Mon–Fri 9am–5pm
  </div>
</div>
</body></html>`;
}

/** Internal notification sent to CCMS. */
export function internalEmail(data: RequestData, submittedAt: string) {
  return {
    subject: `New Survey Request — ${data.company} — ${data.service}`,
    html: shell(
      "New survey request",
      `<p style="margin:0 0 16px;color:${MUTED};font-size:14px">Reply to this email to respond directly to ${escapeHtml(data.name)}.</p>
       ${table(summaryRows(data, submittedAt))}`,
    ),
  };
}

/** Confirmation sent to the person who submitted the form. */
export function clientEmail(data: RequestData, submittedAt: string) {
  const first = data.name.trim().split(/\s+/)[0] || data.name;
  return {
    subject: `We received your survey request — ${site.name}`,
    html: shell(
      `Thanks, ${escapeHtml(first)}.`,
      `<p style="margin:0 0 12px">We've received your request and will be in touch shortly to confirm the details and schedule the survey.</p>
       <p style="margin:0 0 20px">Need to reach us sooner? Call <a href="tel:${site.phoneHref.replace("tel:", "")}" style="color:${NAVY};font-weight:600">${site.phone}</a> (Mon–Fri 9am–5pm) or reply to this email.</p>
       <p style="margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${MUTED}">Your request</p>
       ${table(summaryRows(data, submittedAt))}
       <p style="margin:20px 0 0;color:${MUTED};font-size:13px">Stanley Carew, President<br>${site.name}</p>`,
    ),
  };
}
