import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X, MessageSquare, Calendar, MapPin, Sparkles, Loader2, CalendarCheck } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChannelIcon } from "@/components/brokai/ChannelIcon";
import { getDisplayName, getInitials, isUnknown } from "@/lib/displayName";
import { useCalendar } from "@/lib/calendarStore";
import type { AiMeeting, Conversation, Reminder } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export type DetailPayload =
  | { kind: "meeting"; meeting: AiMeeting; conv: Conversation }
  | { kind: "lead"; conv: Conversation }
  | { kind: "deal"; conv: Conversation }
  | { kind: "reminder"; reminder: Reminder; conv?: Conversation };

export function DetailSheet({
  payload,
  onClose,
}: {
  payload: DetailPayload | null;
  onClose: () => void;
}) {
  const open = !!payload;
  const navigate = useNavigate();
  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-[520px] sm:max-w-[520px] p-0 flex flex-col gap-0">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur px-5 py-3">
          <button onClick={onClose} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <h2 className="text-sm font-semibold text-foreground">
            {payload?.kind === "meeting" && "Meeting context"}
            {payload?.kind === "lead" && "New lead"}
            {payload?.kind === "deal" && "Deal context"}
            {payload?.kind === "reminder" && "Reminder"}
          </h2>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-accent">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {payload?.kind === "meeting" && <MeetingDetail {...payload} />}
          {payload?.kind === "lead" && <ContactDetail conv={payload.conv} kind="lead" />}
          {payload?.kind === "deal" && <ContactDetail conv={payload.conv} kind="deal" />}
          {payload?.kind === "reminder" && <ReminderDetail reminder={payload.reminder} conv={payload.conv} />}
        </div>

        {payload && "conv" in payload && payload.conv && (
          <footer className="border-t border-border p-4 bg-background">
            <Button
              className="w-full bg-foreground text-background hover:bg-foreground/90"
              onClick={() => {
                onClose();
                navigate({ to: "/inbox", search: { c: payload.conv!.id } as never });
              }}
            >
              <MessageSquare className="mr-2 h-4 w-4" /> Open full conversation
            </Button>
          </footer>
        )}
      </SheetContent>
    </Sheet>
  );
}

function ContactHeader({ conv }: { conv: Conversation }) {
  const unknown = isUnknown(conv);
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarFallback className={cn("text-sm font-semibold", unknown ? "bg-slate-100 text-slate-500" : "bg-gradient-to-br from-slate-700 to-slate-900 text-white")}>
            {getInitials(conv)}
          </AvatarFallback>
        </Avatar>
        <ChannelIcon channel={conv.channel} className="absolute -bottom-0.5 -right-0.5 h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className={cn("text-base font-semibold truncate", unknown && "italic text-muted-foreground")}>{getDisplayName(conv)}</p>
          {unknown && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-amber-800">Unknown</span>}
        </div>
        <p className="text-xs text-muted-foreground">{conv.handle} · {conv.city}</p>
      </div>
    </div>
  );
}

function MeetingDetail({ meeting, conv }: { meeting: AiMeeting; conv: Conversation }) {
  const { addMeeting, addedMeetingIds, openCalendar } = useCalendar();
  const added = addedMeetingIds.has(meeting.id);
  const [syncing, setSyncing] = useState(false);
  return (
    <>
      <div className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-50/40 p-4">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-700 border border-violet-200">
          <Sparkles className="h-3 w-3" /> AI detected · {meeting.confidence}
        </div>
        <h3 className="mt-2 text-lg font-semibold text-foreground">{meeting.title}</h3>
        <div className="mt-2 space-y-1.5 text-sm text-foreground/80">
          <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-violet-600" />{meeting.when}</div>
          <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-violet-600" />{meeting.location}</div>
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground">Detected from {meeting.detectedFrom}</p>
        <div className="mt-4 flex items-center gap-2">
          {added ? (
            <>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-1 text-xs font-medium text-emerald-700">
                <CalendarCheck className="h-3.5 w-3.5" /> Added to Calendar
              </span>
              <Button size="sm" className="bg-[#1a73e8] hover:bg-[#1765cc] text-white" onClick={() => openCalendar(meeting.id)}>
                <Calendar className="mr-1.5 h-3.5 w-3.5" /> Open Calendar
              </Button>
            </>
          ) : (
            <Button size="sm" disabled={syncing} onClick={() => { setSyncing(true); setTimeout(() => { addMeeting(meeting); setSyncing(false); }, 450); }}>
              {syncing ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Calendar className="mr-1.5 h-3.5 w-3.5" />}
              {syncing ? "Syncing…" : "Add to Calendar"}
            </Button>
          )}
        </div>
      </div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Contact</p>
        <ContactHeader conv={conv} />
      </div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Recent messages</p>
        <div className="space-y-2 rounded-xl border border-border bg-muted/30 p-3">
          {conv.messages.slice(-3).map((m) => (
            <div key={m.id} className="text-xs">
              <span className="font-medium text-foreground">{m.from === "me" ? "You" : getDisplayName(conv)}: </span>
              <span className="text-foreground/80">{m.text}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function ContactDetail({ conv, kind }: { conv: Conversation; kind: "lead" | "deal" }) {
  return (
    <>
      <ContactHeader conv={conv} />
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Stage" value={conv.stage} />
        <Stat label="Ticket size" value={conv.deal.ticketSize} highlight />
        <Stat label="Sector" value={conv.deal.sector} />
        <Stat label="Type" value={conv.deal.type} />
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          {kind === "lead" ? "First message" : "Latest activity"}
        </p>
        <div className="space-y-2 rounded-xl border border-border bg-muted/30 p-3">
          {conv.messages.slice(-4).map((m) => (
            <div key={m.id} className="text-xs">
              <span className="font-medium text-foreground">{m.from === "me" ? "You" : getDisplayName(conv)}: </span>
              <span className="text-foreground/80">{m.text}</span>
            </div>
          ))}
        </div>
      </div>
      {conv.deal.actionItems.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">AI suggested actions</p>
          <ul className="space-y-1.5">
            {conv.deal.actionItems.map((a) => (
              <li key={a.id} className="flex items-start gap-2 text-xs text-foreground/90">
                <span className={cn("mt-1 h-1.5 w-1.5 rounded-full shrink-0", a.done ? "bg-emerald-500" : "bg-amber-500")} />
                <span className={a.done ? "line-through text-muted-foreground" : ""}>{a.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

function ReminderDetail({ reminder, conv }: { reminder: Reminder; conv?: Conversation }) {
  return (
    <>
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{reminder.urgency} urgency · {reminder.type}</p>
        <h3 className="mt-1 text-lg font-semibold text-foreground">{reminder.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{reminder.when}</p>
      </div>
      {conv && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Related contact</p>
          <ContactHeader conv={conv} />
        </div>
      )}
    </>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-muted/20 p-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={cn("mt-1 text-sm", highlight ? "font-semibold text-foreground" : "text-foreground/90")}>{value}</p>
    </div>
  );
}
