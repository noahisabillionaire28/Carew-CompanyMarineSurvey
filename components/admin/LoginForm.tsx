"use client";

import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { inputClass, labelClass, primaryBtn } from "./ui";

export default function LoginForm({ next, configured }: { next: string; configured: boolean }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(
    configured ? null : "Staff login is not set up yet. Ask your website admin.",
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const username = String(form.get("username") ?? "").trim();
    const password = String(form.get("password") ?? "");
    if (!username || !password) {
      setError("Enter your username and password.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!res.ok || !data?.ok) {
        setError(data?.error ?? "Wrong username or password.");
        setBusy(false);
        return;
      }
      // Full navigation so the new cookie is used for the first server render.
      window.location.assign(next);
    } catch {
      setError("Could not reach the server. Please try again.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="username" className={labelClass}>
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          required
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="password" className={labelClass}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </div>
      {error && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
      <button type="submit" disabled={busy || !configured} className={`${primaryBtn} w-full py-3.5 text-base`}>
        {busy && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
