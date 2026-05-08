import { motion } from "framer-motion";
import type { Conversation, DealStage } from "@/lib/mockData";
import { getDisplayName } from "@/lib/displayName";
import { cn } from "@/lib/utils";

const STAGES: DealStage[] = ["Lead", "Qualified", "Mandate", "Signed", "Disbursed"];

const STAGE_STYLE: Record<DealStage, string> = {
  Lead: "border-amber-200 bg-amber-50/50",
  Qualified: "border-blue-200 bg-blue-50/50",
  Mandate: "border-violet-200 bg-violet-50/50",
  Signed: "border-emerald-200 bg-emerald-50/50",
  Disbursed: "border-slate-200 bg-slate-50/50",
};

const STAGE_DOT: Record<DealStage, string> = {
  Lead: "bg-amber-500",
  Qualified: "bg-blue-500",
  Mandate: "bg-violet-500",
  Signed: "bg-emerald-500",
  Disbursed: "bg-slate-400",
};

export function PipelineStrip({ conversations, onSelect }: { conversations: Conversation[]; onSelect?: (c: Conversation) => void }) {
  const grouped = STAGES.map((s) => ({ stage: s, items: conversations.filter((c) => c.stage === s) }));
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Active pipeline</h3>
        <span className="text-[11px] text-muted-foreground">By stage · {conversations.length} deals</span>
      </div>
      <div className="grid grid-cols-5 gap-3">
        {grouped.map(({ stage, items }) => (
          <div key={stage} className={cn("rounded-xl border p-3", STAGE_STYLE[stage])}>
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-foreground">
                <span className={cn("h-1.5 w-1.5 rounded-full", STAGE_DOT[stage])} />
                {stage}
              </span>
              <span className="text-[10px] text-muted-foreground">{items.length}</span>
            </div>
            <div className="space-y-1.5">
              {items.length === 0 && <p className="text-[10px] text-muted-foreground italic">empty</p>}
              {items.slice(0, 3).map((c, i) => (
                <motion.button
                  key={c.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => onSelect?.(c)}
                  className="w-full rounded-md bg-white border border-border/60 px-2 py-1.5 text-left hover:shadow-sm transition-shadow"
                >
                  <p className="text-[11px] font-medium text-foreground truncate">{getDisplayName(c)}</p>
                  <p className="text-[10px] text-muted-foreground">{c.deal.ticketSize}</p>
                </motion.button>
              ))}
              {items.length > 3 && (
                <p className="text-[10px] text-muted-foreground text-center">+{items.length - 3} more</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
