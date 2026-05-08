import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ChatList } from "@/components/brokai/ChatList";
import { ChatThread } from "@/components/brokai/ChatThread";
import { DealSidebar } from "@/components/brokai/DealSidebar";
import { conversations } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const searchSchema = z.object({ c: z.string().optional() });

export const Route = createFileRoute("/inbox")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Inbox · Brokai" },
      { name: "description", content: "Unified WhatsApp, Instagram & LinkedIn inbox for dealmakers." },
    ],
  }),
  component: InboxPage,
});

function InboxPage() {
  const search = Route.useSearch();
  const initial = search.c && conversations.some((c) => c.id === search.c) ? search.c : null;
  const [activeId, setActiveId] = useState(initial || conversations[0].id);
  const [mobileView, setMobileView] = useState<"list" | "chat" | "details">(initial ? "chat" : "list");
  
  const active = conversations.find((c) => c.id === activeId)!;

  const handleSelect = (id: string) => {
    setActiveId(id);
    setMobileView("chat");
  };

  return (
    <>
      <div className={cn("w-full md:w-[320px] shrink-0 md:flex flex-col pb-24 md:pb-0", mobileView === "list" ? "flex" : "hidden")}>
        <ChatList activeId={activeId} onSelect={handleSelect} />
      </div>
      
      <div className={cn("flex-1 overflow-hidden md:flex", mobileView === "chat" ? "flex" : "hidden")}>
        <ChatThread 
          conversation={active} 
          className="h-[100dvh]" 
          onBack={() => setMobileView("list")} 
          onInfo={() => setMobileView("details")}
        />
      </div>

      <div className={cn("w-full md:w-[320px] shrink-0 md:flex flex-col bg-background pb-24 md:pb-0", mobileView === "details" ? "flex" : "hidden")}>
        <div className="md:hidden flex items-center p-4 border-b border-border bg-muted/20">
          <button onClick={() => setMobileView("chat")} className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm font-medium">
            <span className="p-1 rounded-md bg-background border border-border">Back to chat</span>
          </button>
        </div>
        <DealSidebar conversation={active} />
      </div>
    </>
  );
}
