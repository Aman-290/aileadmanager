import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Flame } from "lucide-react";
import { conversations, type Conversation } from "@/lib/mockData";
import { ChannelIcon } from "@/components/brokai/ChannelIcon";
import { getDisplayName, getInitials } from "@/lib/displayName";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChatThread } from "@/components/brokai/ChatThread";

export const Route = createFileRoute("/followups")({
  component: FollowupsPage,
});

function FollowupsPage() {
  const items = conversations.filter((c) => c.stage !== "Disbursed");
  const [activeChat, setActiveChat] = useState<Conversation | null>(null);

  return (
    <div className="flex-1 overflow-y-auto bg-muted/20 pb-24 md:pb-0">
      <div className="mx-auto max-w-3xl px-4 md:px-8 py-6 md:py-10">
        <header className="mb-8">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-orange-600">
            <Flame className="h-3.5 w-3.5" /> Follow-ups
          </p>
          <h1 className="mt-1 text-2xl font-bold text-foreground">Don't drop these deals</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            AI ranked by deal value × time since last touch.
          </p>
        </header>
        <ul className="space-y-2">
          {items.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveChat(c)}
              className="flex w-full items-center justify-between rounded-xl border border-border bg-background px-4 py-3 shadow-sm hover:bg-muted/30 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-300 text-xs font-semibold text-slate-700">
                    {getInitials(c)}
                  </div>
                  <ChannelIcon channel={c.channel} className="absolute -bottom-0.5 -right-0.5 h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{getDisplayName(c)}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.deal.sector} · {c.deal.ticketSize} · last touch {c.lastActive}
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-700">
                {c.stage}
              </span>
            </button>
          ))}
        </ul>
      </div>

      <Dialog open={!!activeChat} onOpenChange={(open) => !open && setActiveChat(null)}>
        <DialogContent className="p-0 border-none overflow-hidden max-w-md w-[95vw] h-[80vh] md:h-[600px] flex flex-col rounded-2xl sm:rounded-2xl">
          {activeChat && <ChatThread conversation={activeChat} className="h-full rounded-2xl" />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
