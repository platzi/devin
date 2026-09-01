import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const errorDescription = url.searchParams.get("error_description");
  const nextRaw = url.searchParams.get("next") ?? "/";
  const safeNext =
    nextRaw.startsWith("/") && !nextRaw.startsWith("//") ? nextRaw : "/";

  const fail = (message: string) => {
    const loginUrl = new URL("/login", url.origin);
    loginUrl.searchParams.set("error", message);
    return NextResponse.redirect(loginUrl);
  };

  if (errorDescription) return fail(errorDescription);
  if (!code) return fail("Enlace inválido");

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return fail(error.message);

  return NextResponse.redirect(new URL(safeNext, url.origin));
}
