import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { AiMeeting } from "./mockData";

export type CalendarEvent = {
  id: string;
  title: string;
  dayKey: "today" | "tomorrow" | "thu" | "fri" | "wed" | "sat";
  startHour: number;
  durationMin: number;
  color: "blue" | "green" | "violet" | "orange" | "rose" | "teal";
  attendees?: string[];
  location?: string;
  isJatinAdded?: boolean;
  isAiAdded?: boolean;
};

const SEED_EVENTS: CalendarEvent[] = [
  { id: "s1", title: "Morning workout", dayKey: "today", startHour: 7, durationMin: 60, color: "green" },
  { id: "s2", title: "Brokai standup", dayKey: "today", startHour: 10, durationMin: 30, color: "blue", attendees: ["Karthik", "Priya", "Aman"] },
  { id: "s3", title: "Lunch w/ Karthik (CTO)", dayKey: "today", startHour: 13, durationMin: 60, color: "orange", location: "Bombay Canteen, BKC" },
  { id: "s4", title: "Investor sync — Sequoia", dayKey: "tomorrow", startHour: 11, durationMin: 60, color: "violet", attendees: ["Shailendra J.", "Rajan A."], location: "Google Meet" },
  { id: "s5", title: "Gym", dayKey: "tomorrow", startHour: 7, durationMin: 60, color: "green" },
  { id: "s6", title: "Family dinner", dayKey: "tomorrow", startHour: 20, durationMin: 90, color: "rose" },
  { id: "s7", title: "Quarterly board prep", dayKey: "thu", startHour: 9, durationMin: 90, color: "teal" },
  { id: "s8", title: "Karan & Co — site walkthrough", dayKey: "thu", startHour: 15, durationMin: 60, color: "orange", location: "Lower Parel" },
  { id: "s9", title: "Hyderabad flight", dayKey: "fri", startHour: 6, durationMin: 120, color: "blue" },
];

type Ctx = {
  events: CalendarEvent[];
  addedMeetingIds: Set<string>;
  addMeeting: (m: AiMeeting) => void;
  openCalendar: (highlightId?: string) => void;
  isCalendarOpen: boolean;
  highlightId: string | null;
  closeCalendar: () => void;
};

const CalendarCtx = createContext<Ctx | null>(null);

const COLORS: CalendarEvent["color"][] = ["blue", "violet", "teal", "orange"];

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<CalendarEvent[]>(SEED_EVENTS);
  const [addedMeetingIds, setAddedMeetingIds] = useState<Set<string>>(new Set());
  const [isCalendarOpen, setOpen] = useState(false);
  const [highlightId, setHighlight] = useState<string | null>(null);

  const addMeeting = useCallback((m: AiMeeting) => {
    setAddedMeetingIds((prev) => {
      if (prev.has(m.id)) return prev;
      const next = new Set(prev);
      next.add(m.id);
      return next;
    });
    setEvents((prev) => {
      if (prev.some((e) => e.id === `ai-${m.id}`)) return prev;
      const color = COLORS[prev.length % COLORS.length];
      return [
        ...prev,
        {
          id: `ai-${m.id}`,
          title: m.title,
          dayKey: m.dayKey,
          startHour: m.startHour,
          durationMin: m.durationMin,
          color,
          attendees: [m.with, "Jatin Mehra"],
          location: m.location,
          isAiAdded: true,
        },
      ];
    });
  }, []);

  const openCalendar = useCallback((id?: string) => {
    setHighlight(id ? `ai-${id}` : null);
    setOpen(true);
  }, []);

  const closeCalendar = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ events, addedMeetingIds, addMeeting, openCalendar, isCalendarOpen, highlightId, closeCalendar }),
    [events, addedMeetingIds, addMeeting, openCalendar, isCalendarOpen, highlightId, closeCalendar],
  );

  return <CalendarCtx.Provider value={value}>{children}</CalendarCtx.Provider>;
}

export function useCalendar() {
  const ctx = useContext(CalendarCtx);
  if (!ctx) throw new Error("useCalendar must be used inside CalendarProvider");
  return ctx;
}
