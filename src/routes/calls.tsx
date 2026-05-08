import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, ChevronUp, Pause, Phone, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { callLogs } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/calls")({
  component: CallsPage,
});

const urgencyStyle = {
  High: "bg-rose-100 text-rose-700 border-rose-200",
  Medium: "bg-amber-100 text-amber-700 border-amber-200",
  Low: "bg-slate-100 text-slate-600 border-slate-200",
} as const;

function CallsPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-muted/20">
      <div className="mx-auto max-w-3xl px-8 py-10">
        <header className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            AI Voice Receptionist
          </p>
          <h1 className="mt-1 text-2xl font-bold text-foreground">Post-call summaries</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every call your AI receptionist handled, ranked by urgency.
          </p>
        </header>
        <div className="space-y-3">
          {callLogs.map((c) => (
            <CallCard key={c.id} log={c} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CallCard({ log }: { log: (typeof callLogs)[number] }) {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  return (
    <article className="rounded-2xl border border-border bg-background p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background">
            <Phone className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{log.caller}</h3>
            <p className="text-xs text-muted-foreground">
              {log.phone} · {log.time} · {log.duration}
            </p>
          </div>
        </div>
        <span
          className={cn(
            "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
            urgencyStyle[log.urgency],
          )}
        >
          {log.urgency} urgency
        </span>
      </div>

      <p className="mt-4 text-sm text-foreground">{log.reason}</p>

      <div className="mt-4 flex items-center gap-3 rounded-lg border border-border bg-muted/40 px-3 py-2">
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 rounded-full bg-foreground text-background hover:bg-foreground/90"
          onClick={() => setPlaying((p) => !p)}
        >
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </Button>
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-border">
          <div className={cn("h-full bg-foreground", playing ? "w-1/3" : "w-0")} />
        </div>
        <span className="text-[11px] tabular-nums text-muted-foreground">
          {playing ? "0:54" : "0:00"} / {log.duration}
        </span>
      </div>

      <button
        onClick={() => setOpen((o) => !o)}
        className="mt-3 flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        {open ? "Hide" : "Show"} transcript
      </button>
      {open && (
        <p className="mt-2 rounded-lg border border-dashed border-border bg-muted/30 p-3 text-xs leading-relaxed text-foreground">
          {log.transcript}
        </p>
      )}
    </article>
  );
}
