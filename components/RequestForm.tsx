"use client";

import { useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  equipmentOptions,
  locationOptions,
  requestSchema,
  serviceTitles,
} from "@/lib/schema";
import { site } from "@/data/site";

type Errors = Partial<Record<string, string>>;

const inputClass =
  "mt-1.5 block w-full rounded-xl border border-border bg-white px-4 py-3 text-base text-text placeholder:text-muted/70 focus:border-babyblue focus:outline-none focus:ring-3 focus:ring-babyblue";
const labelClass = "block text-sm font-semibold text-navy";
const errorClass = "mt-1.5 text-sm text-red-600";

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
  children: React.ReactNode;
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
        <p id={`${name}-error`} role="alert" className={errorClass}>
          {error}
        </p>
      )}
    </div>
  );
}

/** Animated green check shown after a successful submission. */
function SuccessState({ email }: { email: string }) {
  const reduce = useReducedMotion();
  const ease = [0.16, 1, 0.3, 1] as const;
  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: reduce ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease }}
      className="flex flex-col items-center py-6 text-center sm:py-10"
    >
      <motion.span
        initial={{ scale: reduce ? 1 : 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease, delay: 0.1 }}
        className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600"
      >
        <svg
          viewBox="0 0 24 24"
          width="40"
          height="40"
          fill="none"
          aria-hidden="true"
        >
          <motion.path
            d="M5 12.5l4.5 4.5L19 7.5"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: reduce ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.35 }}
          />
        </svg>
      </motion.span>
      <h2 className="mt-6 text-2xl font-bold leading-tight tracking-tight text-navy sm:text-3xl">
        Request received.
      </h2>
      <p className="mt-3 max-w-md text-base text-muted sm:text-lg">
        Your request has been logged. A confirmation is on its way to{" "}
        <span className="font-semibold text-text">{email}</span>, and we&apos;ll
        be in touch shortly.
      </p>
      <motion.div
        initial={{ opacity: 0, y: reduce ? 0 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease, delay: 0.7 }}
        className="mt-8"
      >
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5 rounded-xl bg-navy px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:scale-[1.02] hover:bg-navy-light active:scale-[0.98] motion-reduce:transform-none"
        >
          <ArrowLeft
            size={18}
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:-translate-x-1 motion-reduce:transform-none"
          />
          Back to homepage
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default function RequestForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);

    const form = e.currentTarget;
    const raw = Object.fromEntries(new FormData(form).entries());
    const parsed = requestSchema.safeParse(raw);

    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      const first = Object.keys(next)[0];
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setErrors({});
    setSending(true);
    try {
      const res = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error("Request failed");
      setSentTo(parsed.data.email);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setServerError(`Something went wrong. Please call ${site.phone}.`);
      setSending(false);
    }
  }

  const aria = (name: string) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  if (sentTo) return <SuccessState email={sentTo} />;

  return (
    <>
      <h2 className="text-xl font-bold tracking-tight text-navy">
        Survey request
      </h2>
      <p className="mt-1 text-sm text-muted">Fields marked * are required.</p>
      <form onSubmit={onSubmit} noValidate className="mt-5 space-y-5 sm:mt-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" name="name" required error={errors.name}>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className={inputClass}
              {...aria("name")}
            />
          </Field>
          <Field label="Company" name="company" required error={errors.company}>
            <input
              id="company"
              name="company"
              type="text"
              autoComplete="organization"
              required
              className={inputClass}
              {...aria("company")}
            />
          </Field>
          <Field label="Phone" name="phone" required error={errors.phone}>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              className={inputClass}
              {...aria("phone")}
            />
          </Field>
          <Field label="Email" name="email" required error={errors.email}>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={inputClass}
              {...aria("email")}
            />
          </Field>
        </div>

        <Field
          label="Service needed"
          name="service"
          required
          error={errors.service}
        >
          <select
            id="service"
            name="service"
            required
            defaultValue=""
            className={inputClass}
            {...aria("service")}
          >
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
          <Field
            label="Equipment type"
            name="equipment"
            required
            error={errors.equipment}
          >
            <select
              id="equipment"
              name="equipment"
              required
              defaultValue=""
              className={inputClass}
              {...aria("equipment")}
            >
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
          <Field
            label="Location"
            name="location"
            required
            error={errors.location}
          >
            <select
              id="location"
              name="location"
              required
              defaultValue=""
              className={inputClass}
              {...aria("location")}
            >
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
            <input
              id="units"
              name="units"
              type="number"
              min={1}
              inputMode="numeric"
              className={inputClass}
              {...aria("units")}
            />
          </Field>
          <Field
            label="Preferred date"
            name="preferredDate"
            error={errors.preferredDate}
          >
            <input
              id="preferredDate"
              name="preferredDate"
              type="date"
              className={inputClass}
              {...aria("preferredDate")}
            />
          </Field>
        </div>

        <Field label="Message" name="message" error={errors.message}>
          <textarea
            id="message"
            name="message"
            rows={4}
            className={inputClass}
            {...aria("message")}
          />
        </Field>

        {/* Honeypot: hidden from people, visible to bots */}
        <div
          className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
          aria-hidden="true"
        >
          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {serverError && (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={sending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-navy px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:scale-[1.02] hover:bg-navy-light active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 motion-reduce:transform-none sm:w-auto"
        >
          {sending && (
            <Loader2 size={18} className="animate-spin" aria-hidden="true" />
          )}
          {sending ? "Sending…" : "Send Request"}
        </button>
      </form>
    </>
  );
}
