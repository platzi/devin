import type { Metadata } from "next";
import { MagicLinkForm } from "@/components/magic-link-form";

export const metadata: Metadata = { title: "Entrar" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { error, next } = await searchParams;
  const nextPath = typeof next === "string" ? next : "/";

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight">ShipLog</h1>
        <p className="mt-1 text-sm text-muted">
          Registra lo que construyes, semana a semana.
        </p>
        <div className="card mt-6">
          {typeof error === "string" ? (
            <p className="mb-4 rounded-md bg-rose-50 p-2 text-sm text-rose-700">
              {error}
            </p>
          ) : null}
          <MagicLinkForm next={nextPath} />
        </div>
      </div>
    </main>
  );
}
