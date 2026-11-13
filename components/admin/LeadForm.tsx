"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { equipmentOptions, leadInputSchema, locationOptions, serviceTitles } from "@/lib/schema";
import { inputClass, labelClass, primaryBtn } from "./ui";

type Errors = Partial<Record<string, string>>;

function Field({
  label,
  name,
  error,
  required,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label}
        {required && (
          <span className="text-red-600" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} role="alert" className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

/** Manual lead entry for phone calls and walk-ins. Same validation as the public form. */
export default function LeadForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);
    const form = e.currentTarget;
    const raw = Object.fromEntries(new FormData(form).entries());
    const parsed = leadInputSchema.safeParse(raw);

    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }

    setErrors({});
    setBusy(true);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; id?: string } | null;
      if (!res.ok || !data?.id) throw new Error("failed");
      router.push(`/admin/leads/${data.id}`);
      router.refresh();
    } catch {
      setServerError("Could not save the lead. Please try again.");
      setBusy(false);
    }
  }

  const aria = (name: string) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" name="name" required error={errors.name}>
          <input id="name" name="name" type="text" autoComplete="off" required className={inputClass} {...aria("name")} />
        </Field>
        <Field label="Company" name="company" required error={errors.company}>
          <input id="company" name="company" type="text" autoComplete="off" required className={inputClass} {...aria("company")} />
        </Field>
        <Field label="Phone" name="phone" required error={errors.phone}>
          <input id="phone" name="phone" type="tel" autoComplete="off" required className={inputClass} {...aria("phone")} />
        </Field>
        <Field label="Email" name="email" required error={errors.email}>
          <input id="email" name="email" type="email" autoComplete="off" required className={inputClass} {...aria("email")} />
        </Field>
      </div>

      <Field label="Service needed" name="service" required error={errors.service}>
        <select id="service" name="service" required defaultValue="" className={inputClass} {...aria("service")}>
          <option value="" disabled>
            Select a service
          </option>
          {serviceTitles.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Equipment type" name="equipment" required error={errors.equipment}>
          <select id="equipment" name="equipment" required defaultValue="" className={inputClass} {...aria("equipment")}>
            <option value="" disabled>
              Select equipment
            </option>
            {equipmentOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Location" name="location" required error={errors.location}>
          <select id="location" name="location" required defaultValue="" className={inputClass} {...aria("location")}>
            <option value="" disabled>
              Select a location
            </option>
            {locationOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Number of units" name="units" error={errors.units}>
          <input id="units" name="units" type="number" min={1} inputMode="numeric" className={inputClass} {...aria("units")} />
        </Field>
        <Field label="Preferred date" name="preferredDate" error={errors.preferredDate}>
          <input id="preferredDate" name="preferredDate" type="date" className={inputClass} {...aria("preferredDate")} />
        </Field>
      </div>

      <Field label="Notes from the call" name="message" error={errors.message}>
        <textarea id="message" name="message" rows={4} className={inputClass} {...aria("message")} />
      </Field>

      {serverError && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {serverError}
        </p>
      )}

      <div className="flex justify-end">
        <button type="submit" disabled={busy} className={`${primaryBtn} w-full sm:w-auto`}>
          {busy && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
          {busy ? "Saving…" : "Save lead"}
        </button>
      </div>
    </form>
  );
}
