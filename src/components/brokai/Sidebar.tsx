import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, MessageSquare, Sparkles, Phone, Flame, Settings, Calendar } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCalendar } from "@/lib/calendarStore";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", icon: LayoutDashboard, label: "Today" },
  { to: "/meetings", icon: Sparkles, label: "Meetings" },
  { to: "/inbox", icon: MessageSquare, label: "Inbox" },
  { to: "/calls", icon: Phone, label: "Calls" },
  { to: "/followups", icon: Flame, label: "Follow-ups" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { openCalendar } = useCalendar();
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex h-screen w-[60px] flex-col items-center justify-between border-r border-border bg-muted/40 py-4 shrink-0">
        <div className="flex flex-col items-center gap-1">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background font-bold text-sm">
            B
          </div>
          {items.map(({ to, icon: Icon, label }) => {
            const active = path === to || (to !== "/" && path.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                title={label}
                className={cn(
                  "group relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                  active ? "bg-foreground text-background" : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <Icon className="h-[18px] w-[18px]" />
              </Link>
            );
          })}
          <button
            title="Calendar"
            onClick={() => openCalendar()}
            className="mt-1 flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <Calendar className="h-[18px] w-[18px]" />
          </button>
        </div>
        <Link to="/settings" title="Settings">
          <Avatar className="h-9 w-9 ring-2 ring-background">
            <AvatarFallback className="bg-gradient-to-br from-orange-400 to-pink-500 text-white text-xs font-semibold">
              JM
            </AvatarFallback>
          </Avatar>
        </Link>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-safe">
        {items.slice(0, 5).map(({ to, icon: Icon, label }) => {
          const active = path === to || (to !== "/" && path.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex flex-col items-center justify-center gap-1 p-3 flex-1 transition-colors",
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-[20px] w-[20px]" />
              <span className="text-[10px] font-medium leading-none">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
