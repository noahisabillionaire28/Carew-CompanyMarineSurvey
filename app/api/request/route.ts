import { NextResponse } from "next/server";
import { Resend } from "resend";
import { requestSchema } from "@/lib/schema";
import { clientEmail, internalEmail } from "@/lib/emails";
import { createLead } from "@/lib/crm/store";

export const runtime = "nodejs";

const DEFAULT_FROM = "CCMS Website <requests@ccms-survey.com>";
const DEFAULT_TO = "carew@ccms-survey.com";

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

  // Step 1: save the lead for the staff CRM. This is the source of truth; if it
  // fails we still send the emails so the request reaches CCMS either way.
  let saved = false;
  try {
    await createLead(data, "website", { name: "website" });
    saved = true;
  } catch (err) {
    console.error("Lead storage error", err);
  }

  // Step 2: email via Resend
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    if (saved) return NextResponse.json({ ok: true });
    return NextResponse.json({ ok: false, error: "Unable to send right now." }, { status: 500 });
  }

  const resend = new Resend(apiKey);
  const from = process.env.FROM_EMAIL || DEFAULT_FROM;
  const to = process.env.NOTIFY_EMAIL || DEFAULT_TO;

  // Email 1: internal notification to CCMS
  try {
    const internal = internalEmail(data, submittedAt);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject: internal.subject,
      html: internal.html,
    });
    if (error) throw error;
  } catch (err) {
    console.error("Resend error (internal)", err);
    // Only fail the request when the lead was not saved anywhere.
    if (!saved) {
      return NextResponse.json({ ok: false, error: "Unable to send right now." }, { status: 500 });
    }
  }

  // Email 2: confirmation to the requester (best effort; never fails the request)
  try {
    const confirm = clientEmail(data, submittedAt);
    const { error } = await resend.emails.send({
      from,
      to: data.email,
      replyTo: to,
      subject: confirm.subject,
      html: confirm.html,
    });
    if (error) console.error("Resend error (confirmation)", error);
  } catch (err) {
    console.error("Resend error (confirmation)", err);
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
