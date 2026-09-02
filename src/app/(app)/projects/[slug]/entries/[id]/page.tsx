import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateEntry } from "@/app/actions/entries";
import { EntryForm } from "@/components/entry-form";

export default async function EditEntryPage({
  params,
}: PageProps<"/projects/[slug]/entries/[id]">) {
  const { slug, id } = await params;
  const supabase = await createClient();
  const { data: entry } = await supabase
    .from("entries")
    .select("*, projects!inner(slug)")
    .eq("id", id)
    .eq("projects.slug", slug)
    .maybeSingle();
  if (!entry) notFound();

  return (
    <>
      <h1 className="text-xl font-semibold">Editar entrada</h1>
      <div className="mt-6">
        <EntryForm
          action={updateEntry}
          projectId={entry.project_id}
          slug={slug}
          entry={entry}
          today={entry.shipped_at}
        />
      </div>
    </>
  );
}
