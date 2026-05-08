import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { aiMeetings, conversations } from "@/lib/mockData";
import { MeetingCard } from "@/components/brokai/dashboard/MeetingCard";
import { DetailSheet, type DetailPayload } from "@/components/brokai/dashboard/DetailSheet";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meetings · Brokai" },
      { name: "description", content: "Every meeting Brokai's AI detected from your conversations." },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const [detail, setDetail] = useState<DetailPayload | null>(null);
  return (
    <div className="flex-1 overflow-y-auto bg-[#FAFAF7] pb-24 md:pb-0">
      <div className="mx-auto max-w-[1080px] px-4 md:px-8 py-6 md:py-8">
        <header className="mb-6">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-violet-700">
            <Sparkles className="h-3.5 w-3.5" /> AI-detected meetings
          </p>
          <h1 className="mt-1 text-xl md:text-2xl font-semibold tracking-tight text-foreground">Your week, parsed</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Brokai reads your WhatsApp, Instagram and LinkedIn threads and surfaces every meeting commitment.
          </p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiMeetings.map((m, i) => {
            const conv = conversations.find((c) => c.id === m.conversationId)!;
            return <MeetingCard key={m.id} meeting={m} index={i} onOpenContext={() => setDetail({ kind: "meeting", meeting: m, conv })} />;
          })}
        </div>
      </div>
      <DetailSheet payload={detail} onClose={() => setDetail(null)} />
    </div>
  );
}
