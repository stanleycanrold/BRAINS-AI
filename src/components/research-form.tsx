"use client";

import { useTransition } from "react";
import { runResearch } from "@/app/dashboard/ideas/[id]/research/actions";
import { Sparkles, Loader2 } from "lucide-react";

export function ResearchForm({ ideaId }: { ideaId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        startTransition(() => {
          runResearch(formData);
        });
      }}
    >
      <input type="hidden" name="ideaId" value={ideaId} />
      <button type="submit" disabled={pending} className="btn-primary gap-2">
        {pending ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Researching…</>
        ) : (
          <><Sparkles className="h-4 w-4" /> Run research</>
        )}
      </button>
    </form>
  );
}
