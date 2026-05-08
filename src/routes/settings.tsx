import { createFileRoute } from "@tanstack/react-router";
import { channels } from "@/lib/mockData";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-muted/20">
      <div className="mx-auto max-w-3xl px-8 py-10">
        <header className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Settings</p>
          <h1 className="mt-1 text-2xl font-bold text-foreground">Connected channels</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            All inboxes flowing into Brokai. Disconnect anytime.
          </p>
        </header>
        <div className="space-y-3">
          {channels.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-xl border border-border bg-background p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white"
                  style={{ backgroundColor: c.color }}
                >
                  {c.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">
                    via {c.provider} · {c.account}
                  </p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                Connected
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
