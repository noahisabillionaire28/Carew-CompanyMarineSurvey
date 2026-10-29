/** CSV export of leads (RFC 4180 quoting, Excel-safe). */
import { SOURCE_LABELS, statusMeta } from "./config";
import { formatDateTime, formatPlainDate } from "./format";
import type { Lead } from "./types";

export const CSV_COLUMNS: { header: string; value: (l: Lead) => string }[] = [
  { header: "Submitted", value: (l) => formatDateTime(l.createdAt) },
  { header: "Status", value: (l) => statusMeta(l.status).label },
  { header: "Source", value: (l) => SOURCE_LABELS[l.source] },
  { header: "Name", value: (l) => l.name },
  { header: "Company", value: (l) => l.company },
  { header: "Phone", value: (l) => l.phone },
  { header: "Email", value: (l) => l.email },
  { header: "Service", value: (l) => l.service },
  { header: "Equipment", value: (l) => l.equipment },
  { header: "Location", value: (l) => l.location },
  { header: "Units", value: (l) => (l.units !== undefined ? String(l.units) : "") },
  { header: "Preferred Date", value: (l) => formatPlainDate(l.preferredDate) },
  { header: "Message", value: (l) => l.message ?? "" },
  {
    header: "Notes",
    value: (l) =>
      l.notes.map((n) => `[${formatDateTime(n.createdAt)} ${n.author}] ${n.body}`).join(" | "),
  },
  { header: "Last Updated", value: (l) => formatDateTime(l.updatedAt) },
  { header: "ID", value: (l) => l.id },
];

function cell(raw: string): string {
  let v = raw ?? "";
  // Stop spreadsheet apps from treating a cell as a formula.
  if (/^[=+\-@\t\r]/.test(v)) v = `'${v}`;
  if (/[",\r\n]/.test(v)) v = `"${v.replace(/"/g, '""')}"`;
  return v;
}

export function leadsToCsv(leads: Lead[]): string {
  const lines = [CSV_COLUMNS.map((c) => cell(c.header)).join(",")];
  for (const lead of leads) {
    lines.push(CSV_COLUMNS.map((c) => cell(c.value(lead))).join(","));
  }
  // BOM so Excel opens it as UTF-8.
  return `﻿${lines.join("\r\n")}\r\n`;
}
