import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChannelIcon } from "@/components/brokai/ChannelIcon";
import { getDisplayName, getInitials, isUnknown } from "@/lib/displayName";
import type { Conversation } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export function LeadCard({ conv, index = 0, onClick }: { conv: Conversation; index?: number; onClick?: () => void }) {
  const name = getDisplayName(conv);
  const unknown = isUnknown(conv);
  return (
    <motion.button
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={onClick}
      className="w-full text-left rounded-xl border border-border bg-card p-3.5 transition-all hover:border-foreground/20 hover:shadow-sm"
    >
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <Avatar className="h-10 w-10">
            <AvatarFallback className={cn(
              "text-xs font-semibold",
              unknown ? "bg-slate-100 text-slate-500" : "bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700",
            )}>
              {getInitials(conv)}
            </AvatarFallback>
          </Avatar>
          <ChannelIcon channel={conv.channel} className="absolute -bottom-0.5 -right-0.5 h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className={cn("text-sm font-semibold truncate", unknown ? "text-muted-foreground italic" : "text-foreground")}>
              {name}
            </p>
            {unknown && <span className="rounded-sm bg-amber-100 px-1.5 text-[9px] font-semibold uppercase text-amber-800">Unknown</span>}
          </div>
          <p className="text-[11px] text-muted-foreground truncate">{conv.deal.ticketSize} · {conv.deal.location}</p>
          <p className="mt-1.5 text-xs text-foreground/80 line-clamp-2 leading-snug">{conv.preview}</p>
        </div>
      </div>
    </motion.button>
  );
}
