import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Users, Wallet, Calendar as CalendarIcon, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { conversations, aiMeetings, reminders } from "@/lib/mockData";
import { useCalendar } from "@/lib/calendarStore";
import { KpiCard } from "@/components/brokai/dashboard/KpiCard";
import { MeetingCard } from "@/components/brokai/dashboard/MeetingCard";
import { RemindersList } from "@/components/brokai/dashboard/RemindersList";
import { LeadCard } from "@/components/brokai/dashboard/LeadCard";
import { PipelineStrip } from "@/components/brokai/dashboard/PipelineStrip";
import { DetailSheet, type DetailPayload } from "@/components/brokai/dashboard/DetailSheet";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Today · Brokai Command Center" },
      { name: "description", content: "Your day at a glance — AI-detected meetings, new leads, reminders and pipeline." },
    ],
  }),
  component: TodayDashboard,
});

function TodayDashboard() {
  const { openCalendar } = useCalendar();
  const [detail, setDetail] = useState<DetailPayload | null>(null);

  const newLeads = useMemo(() => conversations.filter((c) => c.isNewLead), []);
  const activeDeals = useMemo(() => conversations.filter((c) => !c.isNewLead && c.stage !== "Disbursed"), []);
  const totalPipeline = "₹855 Cr";

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAFAF7] pb-24 md:pb-0">
      <div className="mx-auto max-w-[1280px] px-4 md:px-8 py-6 md:py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-4"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{today}</p>
            <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              {greeting}, Jatin
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Brokai prepped your day. <span className="text-foreground font-medium">{aiMeetings.length} meetings</span>, {newLeads.length} new leads.
            </p>
          </div>
          <button
            onClick={() => openCalendar()}
            className="inline-flex w-full md:w-auto items-center justify-center gap-2 rounded-lg border border-border bg-background px-3.5 py-2 text-sm font-medium text-foreground hover:bg-accent shadow-sm"
          >
            <CalendarIcon className="h-4 w-4" /> Open Calendar
          </button>
        </motion.header>

        {/* KPI grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
          <KpiCard label="New meetings" value={String(aiMeetings.length)} delta="AI-detected today" accent="violet" icon={Sparkles} index={0} />
          <KpiCard label="New leads" value={String(newLeads.length)} delta="2 unknown contacts" accent="amber" icon={Users} index={1} />
          <KpiCard label="Active deals" value={String(activeDeals.length)} delta="across 4 stages" accent="blue" icon={TrendingUp} index={2} />
          <KpiCard label="Pipeline" value={totalPipeline} delta="weighted ₹420 Cr" accent="emerald" icon={Wallet} index={3} />
        </section>

        {/* Meetings + Reminders */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
          <div className="lg:col-span-2 rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 md:px-5 py-3.5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-600" />
                <h3 className="text-sm font-semibold text-foreground">AI-detected meetings</h3>
                <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-700">{aiMeetings.length} new</span>
              </div>
              <Link to="/meetings" className="text-[11px] font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                See all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="p-3 md:p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {aiMeetings.map((m, i) => {
                const conv = conversations.find((c) => c.id === m.conversationId)!;
                return <MeetingCard key={m.id} meeting={m} index={i} onOpenContext={() => setDetail({ kind: "meeting", meeting: m, conv })} />;
              })}
            </div>
          </div>
          <div className="lg:col-span-1">
            <RemindersList
              reminders={reminders}
              onSelect={(r) => setDetail({ kind: "reminder", reminder: r, conv: conversations.find((c) => c.id === r.conversationId) })}
            />
          </div>
        </section>

        {/* Leads + Pipeline */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-1 rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 md:px-5 py-3.5">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-amber-600" />
                <h3 className="text-sm font-semibold text-foreground">New leads</h3>
              </div>
              <span className="text-[11px] text-muted-foreground">{newLeads.length} this week</span>
            </div>
            <div className="p-3 md:p-4 space-y-2.5">
              {newLeads.map((c, i) => (
                <LeadCard key={c.id} conv={c} index={i} onClick={() => setDetail({ kind: "lead", conv: c })} />
              ))}
            </div>
          </div>
          <div className="lg:col-span-2 overflow-x-auto pb-4 -mb-4">
            <div className="min-w-[700px] lg:min-w-0">
              <PipelineStrip conversations={activeDeals} onSelect={(c) => setDetail({ kind: "deal", conv: c })} />
            </div>
          </div>
        </section>
      </div>

      <DetailSheet payload={detail} onClose={() => setDetail(null)} />
    </div>
  );
}
