import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { conversations, type DealStage } from "@/lib/mockData";
import { ChannelIcon } from "./ChannelIcon";
import { getDisplayName, getInitials, isUnknown } from "@/lib/displayName";
import { cn } from "@/lib/utils";

const stageStyles: Record<DealStage, string> = {
  Lead: "bg-amber-100 text-amber-800",
  Qualified: "bg-blue-100 text-blue-800",
  Mandate: "bg-violet-100 text-violet-800",
  Signed: "bg-emerald-100 text-emerald-800",
  Disbursed: "bg-slate-200 text-slate-700",
};

export function ChatList({ activeId, onSelect }: { activeId: string; onSelect: (id: string) => void }) {
  return (
    <div className="flex h-full w-full flex-col border-r border-border bg-muted/30">
      <div className="border-b border-border p-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search deals, contacts..."
            className="h-8 border-transparent bg-background pl-8 text-sm shadow-sm focus-visible:ring-1"
          />
        </div>
        <div className="mt-3 flex items-center justify-between px-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Inbox · {conversations.length}
          </span>
          <span className="text-[11px] text-muted-foreground">Sorted by recent</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.map((c) => {
          const active = c.id === activeId;
          return (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={cn(
                "relative flex w-full gap-3 border-l-2 border-transparent px-3 py-3 text-left transition-colors",
                active ? "border-l-foreground bg-background shadow-sm" : "hover:bg-accent/60",
              )}
            >
              <div className="relative shrink-0">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className={cn("text-xs font-semibold",
                    isUnknown(c) ? "bg-slate-100 text-slate-500" : "bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700")}>
                    {getInitials(c)}
                  </AvatarFallback>
                </Avatar>
                <ChannelIcon channel={c.channel} className="absolute -bottom-0.5 -right-0.5 h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className={cn("truncate text-sm font-semibold", isUnknown(c) ? "italic text-muted-foreground" : "text-foreground")}>
                    {getDisplayName(c)}
                  </span>
                  <span className="shrink-0 text-[11px] text-muted-foreground">{c.lastActive}</span>
                </div>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{c.preview}</p>
                <div className="mt-1.5 flex items-center justify-between">
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                      stageStyles[c.stage],
                    )}
                  >
                    {c.stage} · {c.deal.ticketSize}
                  </span>
                  {c.unread ? (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-semibold text-background">
                      {c.unread}
                    </span>
                  ) : null}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
