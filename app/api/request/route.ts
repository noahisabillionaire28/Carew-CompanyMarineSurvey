import { NextResponse } from "next/server";
import { Resend } from "resend";
import { requestSchema, type RequestData } from "@/lib/schema";

export const runtime = "nodejs";

const FROM = "CCMS Website <requests@ccms-survey.com>";
const DEFAULT_TO = "carew@ccms-survey.com";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHtml(data: RequestData, submittedAt: string) {
  const rows: [string, string][] = [
    ["Submitted At", submittedAt],
    ["Name", data.name],
    ["Company", data.company],
    ["Phone", data.phone],
    ["Email", data.email],
    ["Service", data.service],
    ["Equipment Type", data.equipment],
    ["Location", data.location],
    ["Units", data.units !== undefined ? String(data.units) : "—"],
    ["Preferred Date", data.preferredDate || "—"],
    ["Message", data.message || "—"],
  ];

  const tr = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;border:1px solid #DCE8F3;background:#E9F4FC;font-weight:600;color:#0B1F3A;white-space:nowrap">${k}</td><td style="padding:8px 12px;border:1px solid #DCE8F3;color:#1E293B">${escapeHtml(v).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("");

  return `<!doctype html><html><body style="font-family:Arial,Helvetica,sans-serif;color:#1E293B;line-height:1.5">
<h2 style="color:#0B1F3A;margin:0 0 16px">New Survey Request</h2>
<table cellspacing="0" cellpadding="0" style="border-collapse:collapse;min-width:480px">${tr}</table>
<p style="margin-top:16px;color:#64748B;font-size:12px">Sent from the ccms-survey.com request form.</p>
</body></html>`;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Please check the form fields." }, { status: 400 });
  }

  const data = parsed.data;

  // Honeypot: bots fill this; respond as if successful and do nothing.
  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  const submittedAt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());

  // Step 1: email via Resend (primary)
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return NextResponse.json({ ok: false, error: "Unable to send right now." }, { status: 500 });
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM,
      to: process.env.NOTIFY_EMAIL || DEFAULT_TO,
      replyTo: data.email,
      subject: `New Survey Request — ${data.company} — ${data.service}`,
      html: buildHtml(data, submittedAt),
    });
    if (error) throw error;
  } catch (err) {
    console.error("Resend error", err);
    return NextResponse.json({ ok: false, error: "Unable to send right now." }, { status: 500 });
  }

  // Step 2: Google Sheets backup (non-blocking; never fails the request)
  const webhook = process.env.SHEETS_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submittedAt, ...data, website: undefined }),
      });
    } catch (err) {
      console.error("Sheets webhook error", err);
    }
  }

  return NextResponse.json({ ok: true });
}
