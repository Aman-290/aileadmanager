import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, CalendarCheck, ChevronLeft, Info, Loader2, Paperclip, Send, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/lib/mockData";
import { aiMeetings } from "@/lib/mockData";
import { getDisplayName, isUnknown } from "@/lib/displayName";
import { useCalendar } from "@/lib/calendarStore";

const channelBubble = {
  whatsapp: { me: "bg-[#E7FFDB] text-slate-900", them: "bg-white text-slate-900 border border-border" },
  instagram: {
    me: "bg-gradient-to-br from-[#F58529]/15 via-[#DD2A7B]/15 to-[#8134AF]/15 text-slate-900",
    them: "bg-white text-slate-900 border border-border",
  },
  linkedin: { me: "bg-[#E8F0FB] text-slate-900", them: "bg-white text-slate-900 border border-border" },
} as const;

const channelLabel = { whatsapp: "WhatsApp", instagram: "Instagram", linkedin: "LinkedIn" } as const;

export function ChatThread({ 
  conversation, 
  className = "h-[100dvh]",
  onBack,
  onInfo 
}: { 
  conversation: Conversation; 
  className?: string;
  onBack?: () => void;
  onInfo?: () => void;
}) {
  const [showChip, setShowChip] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const meeting = aiMeetings.find((m) => m.conversationId === conversation.id);
  const { addedMeetingIds, addMeeting, openCalendar } = useCalendar();
  const isAdded = meeting ? addedMeetingIds.has(meeting.id) : false;

  useEffect(() => {
    setShowChip(false);
    setDismissed(false);
    if (!conversation.hasMeetingIntent || !meeting) return;
    const t = setTimeout(() => setShowChip(true), 1200);
    return () => clearTimeout(t);
  }, [conversation.id, conversation.hasMeetingIntent, meeting]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [conversation.id]);

  const bubbles = channelBubble[conversation.channel];
  const displayName = getDisplayName(conversation);

  return (
    <div className={cn("flex flex-1 flex-col bg-[#FAFAF7] overflow-hidden", className)}>
      <header className="flex items-center justify-between border-b border-border bg-background/80 px-4 md:px-5 py-3 backdrop-blur shrink-0">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="md:hidden -ml-1 p-1 text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <div>
            <h2 className={cn("text-sm font-semibold", isUnknown(conversation) ? "italic text-muted-foreground" : "text-foreground")}>
              {displayName}
              {isUnknown(conversation) && <span className="ml-2 not-italic rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-amber-800">Unknown · tap to save</span>}
            </h2>
            <p className="text-xs text-muted-foreground line-clamp-1 break-all">
              {channelLabel[conversation.channel]} · {conversation.handle} · Active {conversation.lastActive}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0 pl-2">
          <span className="hidden md:inline-flex rounded-md border border-border bg-muted/60 px-2 py-1">{conversation.city}</span>
          {onInfo && (
            <button onClick={onInfo} className="md:hidden p-1 text-muted-foreground hover:text-foreground">
              <Info className="h-5 w-5" />
            </button>
          )}
        </div>
      </header>

      {/* Subtle inline AI chip — replaces the big banner */}
      <AnimatePresence>
        {showChip && meeting && !dismissed && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="mx-5 mt-3 flex items-center gap-2 rounded-lg border border-violet-200/70 bg-violet-50/60 px-3 py-1.5 text-xs"
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-violet-600" />
            <span className="text-violet-900 font-medium">
              {isAdded ? "Added to Calendar" : "AI detected meeting"}
            </span>
            <span className="text-violet-700/80 truncate flex-1">· {meeting.when} · {meeting.location}</span>
            {isAdded ? (
              <button onClick={() => openCalendar(meeting.id)}
                className="inline-flex items-center gap-1 rounded-md bg-[#1a73e8] px-2 py-0.5 text-[11px] font-medium text-white hover:bg-[#1765cc]">
                <Calendar className="h-3 w-3" /> Open Calendar
              </button>
            ) : (
              <button disabled={syncing}
                onClick={() => { setSyncing(true); setTimeout(() => { addMeeting(meeting); setSyncing(false); }, 450); }}
                className="inline-flex items-center gap-1 rounded-md bg-foreground px-2 py-0.5 text-[11px] font-medium text-background hover:bg-foreground/90 disabled:opacity-60">
                {syncing ? <Loader2 className="h-3 w-3 animate-spin" /> : <CalendarCheck className="h-3 w-3" />}
                {syncing ? "Syncing" : "Add"}
              </button>
            )}
            <button onClick={() => setDismissed(true)} className="text-violet-600/70 hover:text-violet-900">
              <X className="h-3 w-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-6">
        {conversation.messages.map((m) => (
          <div key={m.id} className={cn("flex", m.from === "me" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[68%] rounded-2xl px-3.5 py-2 text-sm shadow-sm",
                m.from === "me" ? bubbles.me : bubbles.them,
              )}
            >
              <p className="leading-snug">{m.text}</p>
              <p className="mt-1 text-right text-[10px] text-slate-500">{m.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border bg-background px-5 py-3">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2">
          <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            placeholder={`Reply on ${channelLabel[conversation.channel]}…`}
            className="h-8 border-transparent bg-transparent shadow-none focus-visible:ring-0"
          />
          <Button size="sm" className="h-8 bg-foreground text-background hover:bg-foreground/90">
            <Send className="mr-1 h-3.5 w-3.5" /> Send
          </Button>
        </div>
      </div>
    </div>
  );
}
