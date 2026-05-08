import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  delta,
  accent,
  icon: Icon,
  index = 0,
  onClick,
}: {
  label: string;
  value: string;
  delta?: string;
  accent: "violet" | "emerald" | "amber" | "blue";
  icon: React.ComponentType<{ className?: string }>;
  index?: number;
  onClick?: () => void;
}) {
  const accentMap = {
    violet: "from-violet-500/10 to-violet-500/0 text-violet-600 ring-violet-200",
    emerald: "from-emerald-500/10 to-emerald-500/0 text-emerald-600 ring-emerald-200",
    amber: "from-amber-500/10 to-amber-500/0 text-amber-600 ring-amber-200",
    blue: "from-blue-500/10 to-blue-500/0 text-blue-600 ring-blue-200",
  };
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-shadow hover:shadow-md"
    >
      <div className={cn("absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br blur-2xl opacity-60", accentMap[accent])} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
          {delta && <p className="mt-1 text-xs text-muted-foreground">{delta}</p>}
        </div>
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl bg-white ring-1", accentMap[accent])}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </motion.button>
  );
}
