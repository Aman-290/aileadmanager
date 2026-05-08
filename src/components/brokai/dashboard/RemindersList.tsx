import { motion } from "framer-motion";
import { Bell, Phone, Calendar, FileText, Users } from "lucide-react";
import type { Reminder } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const ICONS = { call: Phone, meeting: Calendar, followup: Users, doc: FileText } as const;
const URGENCY = {
  high: "bg-rose-50 text-rose-700 border-rose-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-slate-50 text-slate-600 border-slate-200",
} as const;

export function RemindersList({ reminders, onSelect }: { reminders: Reminder[]; onSelect?: (r: Reminder) => void }) {
  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-amber-600" />
          <h3 className="text-sm font-semibold text-foreground">Upcoming reminders</h3>
        </div>
        <span className="text-[11px] text-muted-foreground">{reminders.length} pending</span>
      </div>
      <ul className="divide-y divide-border">
        {reminders.map((r, i) => {
          const Icon = ICONS[r.type];
          return (
            <motion.li
              key={r.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <button
                onClick={() => onSelect?.(r)}
                className="group flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-accent/50 transition-colors"
              >
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl border", URGENCY[r.urgency])}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{r.title}</p>
                  <p className="text-xs text-muted-foreground">{r.when}</p>
                </div>
                <span className={cn("text-[10px] font-medium uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity", r.urgency === "high" ? "text-rose-600" : "text-muted-foreground")}>
                  {r.urgency}
                </span>
              </button>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
