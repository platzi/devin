"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
        <p className="mt-1 text-sm text-muted-foreground">
          Enviamos un enlace de acceso a <strong>{email}</strong>.
        </p>
        <Button
          type="button"
          variant="link"
          size="sm"
          className="mt-4 text-xs text-muted-foreground"
          onClick={() => setStatus("idle")}
        >
          Usar otro correo
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="grid gap-2">
        <Label htmlFor="email">Correo</Label>
        <Input
          id="email"
          type="email"
          required
          autoComplete="email"
          placeholder="tu@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "sending"}
        />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Enviando…" : "Enviar enlace de acceso"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Sin contraseña. Si es tu primera vez, se crea tu cuenta.
      </p>
    </form>
  );
}
