import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Settings, HelpCircle, Menu, ChevronLeft, ChevronRight, Plus, Video, MapPin, Users, X, Sparkles } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCalendar, type CalendarEvent } from "@/lib/calendarStore";
import { cn } from "@/lib/utils";

const DAYS: { key: CalendarEvent["dayKey"]; label: string; date: number; isToday?: boolean }[] = [
  { key: "today", label: "Mon", date: 12, isToday: true },
  { key: "tomorrow", label: "Tue", date: 13 },
  { key: "wed", label: "Wed", date: 14 },
  { key: "thu", label: "Thu", date: 15 },
  { key: "fri", label: "Fri", date: 16 },
  { key: "sat", label: "Sat", date: 17 },
];

const HOURS = Array.from({ length: 14 }, (_, i) => i + 6); // 6 AM → 7 PM
const HOUR_HEIGHT = 56;

const COLOR_MAP: Record<CalendarEvent["color"], { bg: string; border: string; text: string }> = {
  blue: { bg: "bg-[#1A73E8]", border: "border-[#1A73E8]", text: "text-white" },
  green: { bg: "bg-[#0B8043]", border: "border-[#0B8043]", text: "text-white" },
  violet: { bg: "bg-[#7986CB]", border: "border-[#7986CB]", text: "text-white" },
  orange: { bg: "bg-[#F4511E]", border: "border-[#F4511E]", text: "text-white" },
  rose: { bg: "bg-[#D81B60]", border: "border-[#D81B60]", text: "text-white" },
  teal: { bg: "bg-[#039BE5]", border: "border-[#039BE5]", text: "text-white" },
};

export function GoogleCalendarMock() {
  const { isCalendarOpen, closeCalendar, events, highlightId } = useCalendar();
  const [selected, setSelected] = useState<CalendarEvent | null>(null);

  return (
    <Dialog open={isCalendarOpen} onOpenChange={(o) => !o && closeCalendar()}>
      <DialogContent className="max-w-[1280px] w-[98vw] h-[92vh] p-0 gap-0 overflow-hidden bg-white border-0 sm:rounded-xl shadow-2xl [&>button.absolute]:hidden">
        {/* GCal top bar */}
        <div className="flex items-center justify-between border-b border-[#dadce0] px-4 py-2 bg-white">
          <div className="flex items-center gap-2">
            <button className="p-2.5 rounded-full hover:bg-[#f1f3f4] text-[#5f6368] transition-colors"><Menu className="h-6 w-6" /></button>
            <div className="flex items-center gap-1.5 px-2">
              <img src="https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_12_2x.png" alt="Google Calendar" className="w-10 h-10 object-contain" />
              <span className="text-[22px] text-[#3c4043] font-normal tracking-tight" style={{ fontFamily: "'Product Sans', 'Google Sans', Roboto, system-ui" }}>Calendar</span>
            </div>
            <div className="ml-6 flex items-center gap-1 text-[#3c4043]">
              <button className="px-4 py-1.5 text-sm font-medium rounded border border-[#dadce0] hover:bg-[#f1f3f4] transition-colors">Today</button>
              <button className="ml-2 p-1.5 rounded-full hover:bg-[#f1f3f4] text-[#5f6368] transition-colors"><ChevronLeft className="h-5 w-5" /></button>
              <button className="p-1.5 rounded-full hover:bg-[#f1f3f4] text-[#5f6368] transition-colors"><ChevronRight className="h-5 w-5" /></button>
              <span className="ml-3 text-[22px] font-normal tracking-tight" style={{ fontFamily: "'Product Sans', 'Google Sans', Roboto, system-ui" }}>May 2026</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-full hover:bg-[#f1f3f4] text-[#5f6368] transition-colors"><Search className="h-5 w-5" /></button>
            <button className="p-2 rounded-full hover:bg-[#f1f3f4] text-[#5f6368] transition-colors"><HelpCircle className="h-5 w-5" /></button>
            <button className="p-2 rounded-full hover:bg-[#f1f3f4] text-[#5f6368] transition-colors"><Settings className="h-5 w-5" /></button>
            <button className="ml-2 px-3 py-1.5 text-sm font-medium rounded border border-[#dadce0] hover:bg-[#f1f3f4] transition-colors flex items-center gap-2">Week <svg width="20" height="20" viewBox="0 0 24 24" fill="#5f6368"><path d="M7 10l5 5 5-5z"/></svg></button>
            <div className="ml-4 flex items-center gap-2">
              <svg className="h-8 w-8 text-[#5f6368] hover:bg-[#f1f3f4] p-1 rounded-full cursor-pointer" viewBox="0 0 24 24"><path fill="currentColor" d="M12 4a4 4 0 014 4 4 4 0 01-4 4 4 4 0 01-4-4 4 4 0 014-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z"/></svg>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-semibold flex items-center justify-center ring-2 ring-white cursor-pointer hover:ring-indigo-100 transition-all">JM</div>
            </div>
            <div className="ml-4 pl-4 border-l border-[#dadce0]">
              <button onClick={closeCalendar} className="p-2 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"><X className="h-5 w-5" /></button>
            </div>
          </div>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Left rail */}
          <div className="w-[256px] shrink-0 border-r border-[#dadce0] p-4 bg-white">
            <button className="flex items-center gap-3 rounded-full bg-white shadow-[0_1px_2px_0_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] hover:shadow-[0_1px_2px_0_rgba(60,64,67,0.3),0_2px_6px_2px_rgba(60,64,67,0.15)] transition-shadow hover:bg-[#f8f9fa] pl-2 pr-6 py-2 mb-6">
              <svg width="36" height="36" viewBox="0 0 36 36"><path fill="#34A853" d="M16 16v14h4V20z"/><path fill="#4285F4" d="M30 16H20l-4 4h14z"/><path fill="#FBBC05" d="M6 16v4h10l4-4z"/><path fill="#EA4335" d="M20 16V2h-4v14z"/><path fill="none" d="M0 0h36v36H0z"/></svg>
              <span className="text-[14px] font-medium text-[#3c4043]">Create</span>
            </button>
            <MiniMonth />
            <div className="mt-6">
              <p className="text-xs font-medium text-[#3c4043] mb-2">My calendars</p>
              {[
                { c: "#1A73E8", l: "Jatin Mehra" },
                { c: "#0B8043", l: "Personal" },
                { c: "#7986CB", l: "Brokai" },
                { c: "#F4511E", l: "Deals" },
              ].map((x) => (
                <div key={x.l} className="flex items-center gap-3 py-1 text-[13px] text-[#3c4043]">
                  <span className="h-3.5 w-3.5 rounded-sm" style={{ backgroundColor: x.c }} />
                  {x.l}
                </div>
              ))}
            </div>
          </div>

          {/* Week grid */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <div className="grid border-b border-[#dadce0] bg-white" style={{ gridTemplateColumns: `60px repeat(${DAYS.length}, 1fr)` }}>
              <div />
              {DAYS.map((d) => (
                <div key={d.key} className="px-2 py-2 text-center border-l border-[#dadce0]">
                  <div className="text-[11px] uppercase tracking-wide text-[#70757a]">{d.label}</div>
                  <div className={cn(
                    "mt-1 inline-flex items-center justify-center h-9 w-9 rounded-full text-2xl font-light",
                    d.isToday ? "bg-[#1a73e8] text-white" : "text-[#3c4043]",
                  )}>{d.date}</div>
                </div>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto bg-white">
              <div className="grid relative" style={{ gridTemplateColumns: `60px repeat(${DAYS.length}, 1fr)` }}>
                {/* Hours column */}
                <div>
                  {HOURS.map((h) => (
                    <div key={h} style={{ height: HOUR_HEIGHT }} className="relative">
                      <span className="absolute -top-2 right-2 text-[10px] text-[#70757a]">
                        {h === 12 ? "12 PM" : h > 12 ? `${h - 12} PM` : `${h} AM`}
                      </span>
                    </div>
                  ))}
                </div>
                {DAYS.map((day) => (
                  <div key={day.key} className="relative border-l border-[#dadce0]">
                    {HOURS.map((h) => (
                      <div key={h} style={{ height: HOUR_HEIGHT }} className="border-b border-[#e8eaed]" />
                    ))}
                    {events
                      .filter((e) => e.dayKey === day.key)
                      .map((e) => {
                        const top = (e.startHour - HOURS[0]) * HOUR_HEIGHT;
                        const height = (e.durationMin / 60) * HOUR_HEIGHT - 2;
                        const palette = COLOR_MAP[e.color];
                        const isHighlight = highlightId === e.id;
                        return (
                          <motion.button
                            key={e.id}
                            onClick={() => setSelected(e)}
                            initial={isHighlight ? { scale: 0.6, opacity: 0 } : false}
                            animate={isHighlight ? { scale: 1, opacity: 1 } : { opacity: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 18 }}
                            className={cn(
                              "absolute left-1 right-1 rounded px-2 py-1 text-left overflow-hidden shadow-sm hover:shadow-md transition-shadow",
                              palette.bg, palette.text,
                              isHighlight && "ring-2 ring-offset-2 ring-amber-400",
                            )}
                            style={{ top, height }}
                          >
                            <div className="text-[11px] font-medium leading-tight truncate flex items-center gap-1">
                              {e.isAiAdded && <Sparkles className="h-3 w-3 shrink-0" />} {e.title}
                            </div>
                            <div className="text-[10px] opacity-90 truncate">
                              {fmtHour(e.startHour)} – {fmtHour(e.startHour + e.durationMin / 60)}
                            </div>
                            {isHighlight && (
                              <motion.span
                                className="absolute inset-0 rounded ring-2 ring-amber-300"
                                initial={{ opacity: 1 }}
                                animate={{ opacity: [1, 0.2, 1, 0.2, 1, 0] }}
                                transition={{ duration: 2.4, ease: "easeInOut" }}
                              />
                            )}
                          </motion.button>
                        );
                      })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Event popover */}
        <AnimatePresence>
          {selected && <EventPopover event={selected} onClose={() => setSelected(null)} />}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

function fmtHour(h: number) {
  const whole = Math.floor(h);
  const min = Math.round((h - whole) * 60);
  const period = whole >= 12 ? "PM" : "AM";
  const display = whole > 12 ? whole - 12 : whole === 0 ? 12 : whole;
  return `${display}:${min.toString().padStart(2, "0")} ${period}`;
}

function MiniMonth() {
  const days = Array.from({ length: 35 }, (_, i) => i - 3); // shifted so day 12 lands mid-grid
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-[#3c4043]">May 2026</span>
        <div className="flex">
          <button className="p-1 rounded hover:bg-slate-100"><ChevronLeft className="h-4 w-4 text-slate-600" /></button>
          <button className="p-1 rounded hover:bg-slate-100"><ChevronRight className="h-4 w-4 text-slate-600" /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] text-[#70757a] mb-1">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <div key={i}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center text-[11px]">
        {days.map((d) => {
          const valid = d >= 1 && d <= 31;
          const isToday = d === 12;
          return (
            <div key={d} className={cn(
              "h-6 w-6 mx-auto flex items-center justify-center rounded-full",
              !valid && "text-slate-300",
              valid && !isToday && "text-[#3c4043] hover:bg-slate-100 cursor-pointer",
              isToday && "bg-[#1a73e8] text-white font-medium",
            )}>{valid ? d : ""}</div>
          );
        })}
      </div>
    </div>
  );
}

function EventPopover({ event, onClose }: { event: CalendarEvent; onClose: () => void }) {
  const palette = COLOR_MAP[event.color];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.15 }}
      className="absolute right-6 top-20 w-[420px] bg-white rounded-lg shadow-2xl border border-[#dadce0] z-10 overflow-hidden"
    >
      <div className="flex items-center justify-end px-3 py-2 border-b border-[#e8eaed]">
        <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600"><X className="h-4 w-4" /></button>
      </div>
      <div className="px-5 py-4">
        <div className="flex items-start gap-3">
          <span className={cn("mt-1.5 h-3 w-3 rounded-sm shrink-0", palette.bg)} />
          <div className="flex-1">
            <h3 className="text-xl text-[#3c4043] font-normal leading-snug" style={{ fontFamily: "Google Sans, Roboto, system-ui" }}>
              {event.title}
            </h3>
            <p className="text-sm text-[#5f6368] mt-1">
              {fmtHour(event.startHour)} – {fmtHour(event.startHour + event.durationMin / 60)}
            </p>
            {event.isAiAdded && (
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[11px] text-amber-800 font-medium">
                <Sparkles className="h-3 w-3" /> Added by Brokai AI
              </div>
            )}
          </div>
        </div>
        <div className="mt-5 space-y-3 text-sm text-[#3c4043]">
          {event.location && (
            <div className="flex items-start gap-3"><MapPin className="h-4 w-4 mt-0.5 text-[#5f6368]" /><span>{event.location}</span></div>
          )}
          {event.attendees && (
            <div className="flex items-start gap-3">
              <Users className="h-4 w-4 mt-0.5 text-[#5f6368]" />
              <div>
                <p className="text-sm">{event.attendees.length} guests</p>
                <ul className="mt-1 space-y-0.5 text-[13px] text-[#5f6368]">
                  {event.attendees.map((a) => <li key={a}>· {a}</li>)}
                </ul>
              </div>
            </div>
          )}
          <button className="mt-2 inline-flex items-center gap-2 bg-[#1a73e8] hover:bg-[#1765cc] text-white text-sm font-medium px-4 py-2 rounded">
            <Video className="h-4 w-4" /> Join with Google Meet
          </button>
        </div>
      </div>
    </motion.div>
  );
}
