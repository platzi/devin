"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function MagicLinkForm({ next }: { next: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    const supabase = createClient();
    const redirectTo = new URL("/auth/callback", window.location.origin);
    redirectTo.searchParams.set("next", next);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo.toString() },
    });
    if (error) {
      setError(error.message);
      setStatus("idle");
      return;
    }
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="text-center">
        <p className="font-medium">Revisa tu correo</p>
        <p className="mt-1 text-sm text-muted">
          Enviamos un enlace de acceso a <strong>{email}</strong>.
        </p>
        <button
          type="button"
          className="mt-4 text-xs text-muted underline"
          onClick={() => setStatus("idle")}
        >
          Usar otro correo
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <label htmlFor="email" className="label">
          Correo
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          className="input"
          placeholder="tu@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "sending"}
        />
      </div>
      {error ? <p className="text-sm text-rose-700">{error}</p> : null}
      <button type="submit" className="btn-primary" disabled={status === "sending"}>
        {status === "sending" ? "Enviando…" : "Enviar enlace de acceso"}
      </button>
      <p className="text-center text-xs text-muted">
        Sin contraseña. Si es tu primera vez, se crea tu cuenta.
      </p>
    </form>
  );
}
