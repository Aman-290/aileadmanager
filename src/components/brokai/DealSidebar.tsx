import { useState } from "react";
import { Building2, FileText, MapPin, Tag, Wallet } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import type { Conversation } from "@/lib/mockData";
import { getDisplayName, getInitials, isUnknown } from "@/lib/displayName";
import { cn } from "@/lib/utils";

export function DealSidebar({ conversation }: { conversation: Conversation }) {
  const [items, setItems] = useState(conversation.deal.actionItems);

  // Reset when conversation changes
  if (items[0]?.id && conversation.deal.actionItems[0]?.id !== items[0].id) {
    setItems(conversation.deal.actionItems);
  }

  return (
    <aside className="flex h-full w-full flex-col overflow-y-auto border-l border-border bg-background">
      <div className="flex flex-col items-center border-b border-border px-5 py-6 text-center">
        <Avatar className="h-14 w-14">
          <AvatarFallback className={cn("text-sm font-semibold",
            isUnknown(conversation) ? "bg-slate-100 text-slate-500" : "bg-gradient-to-br from-slate-700 to-slate-900 text-white")}>
            {getInitials(conversation)}
          </AvatarFallback>
        </Avatar>
        <h3 className={cn("mt-3 text-sm font-semibold", isUnknown(conversation) ? "italic text-muted-foreground" : "text-foreground")}>
          {getDisplayName(conversation)}
        </h3>
        <p className="text-xs text-muted-foreground">{conversation.handle}</p>
        <p className="mt-1 text-[11px] text-muted-foreground">{conversation.city}</p>
      </div>

      <section className="border-b border-border px-5 py-4">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Deal</p>
        <div className="space-y-2.5 text-xs">
          <Row icon={Building2} label="Sector" value={conversation.deal.sector} />
          <Row icon={Tag} label="Type" value={conversation.deal.type} />
          <Row icon={Wallet} label="Ticket Size" value={conversation.deal.ticketSize} highlight />
          <Row icon={MapPin} label="Location" value={conversation.deal.location} />
        </div>
      </section>

      <section className="border-b border-border px-5 py-4">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          AI action items
        </p>
        <ul className="space-y-2">
          {items.map((it) => (
            <li key={it.id} className="flex items-start gap-2 text-xs">
              <Checkbox
                checked={!!it.done}
                onCheckedChange={(v) =>
                  setItems((prev) => prev.map((x) => (x.id === it.id ? { ...x, done: !!v } : x)))
                }
                className="mt-0.5"
              />
              <span className={it.done ? "text-muted-foreground line-through" : "text-foreground"}>
                {it.label}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-5 py-4">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Documents</p>
        {conversation.deal.documents.length === 0 ? (
          <p className="text-xs text-muted-foreground">No documents shared yet.</p>
        ) : (
          <ul className="space-y-2">
            {conversation.deal.documents.map((d) => (
              <li
                key={d.id}
                className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/30 px-2.5 py-2 hover:bg-muted/60"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-rose-50 text-rose-600">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-foreground">{d.name}</p>
                  <p className="text-[10px] text-muted-foreground">{d.size}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </aside>
  );
}

function Row({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </span>
      <span className={highlight ? "font-semibold text-foreground" : "text-foreground"}>{value}</span>
    </div>
  );
}
