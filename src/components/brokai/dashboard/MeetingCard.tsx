import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, CalendarCheck, Loader2, MapPin, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChannelIcon } from "@/components/brokai/ChannelIcon";
import { useCalendar } from "@/lib/calendarStore";
import type { AiMeeting } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export function MeetingCard({
  meeting,
  index = 0,
  onOpenContext,
}: {
  meeting: AiMeeting;
  index?: number;
  onOpenContext?: () => void;
}) {
  const { addMeeting, addedMeetingIds, openCalendar } = useCalendar();
  const added = addedMeetingIds.has(meeting.id);
  const [syncing, setSyncing] = useState(false);

  const handleAdd = () => {
    setSyncing(true);
    setTimeout(() => {
      addMeeting(meeting);
      setSyncing(false);
    }, 450);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="group rounded-xl border border-border bg-card p-4 transition-all hover:border-violet-300 hover:shadow-sm"
    >
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <ChannelIcon channel={meeting.channel} className="absolute -bottom-1 -right-1 h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-700">
              AI detected · {meeting.confidence === "high" ? "High confidence" : "Medium"}
            </span>
          </div>
          <p className="mt-0.5 text-sm font-semibold text-foreground truncate">{meeting.title}</p>
          <p className="text-xs text-muted-foreground truncate">with {meeting.with}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{meeting.when}</span>
            <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{meeting.location}</span>
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground/80">Detected from {meeting.detectedFrom}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <button
          onClick={onOpenContext}
          className="text-[11px] font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          View context <ExternalLink className="h-3 w-3" />
        </button>
        <div className="flex items-center gap-2">
          {added ? (
            <>
              <span className={cn("inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-medium text-emerald-700")}>
                <CalendarCheck className="h-3 w-3" /> Added
              </span>
              <Button size="sm" className="h-7 bg-[#1a73e8] hover:bg-[#1765cc] text-white text-xs"
                onClick={() => openCalendar(meeting.id)}>
                <Calendar className="mr-1 h-3 w-3" /> Open Calendar
              </Button>
            </>
          ) : (
            <Button size="sm" disabled={syncing} onClick={handleAdd}
              className="h-7 bg-foreground text-background hover:bg-foreground/90 text-xs">
              {syncing ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Calendar className="mr-1 h-3 w-3" />}
              {syncing ? "Syncing…" : "Add to Calendar"}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
