import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { Sidebar } from "@/components/brokai/Sidebar";
import { VoiceAgentWidget } from "@/components/brokai/VoiceAgentWidget";
import { CalendarProvider } from "@/lib/calendarStore";
import { GoogleCalendarMock } from "@/components/brokai/GoogleCalendarMock";
import { useState, useEffect } from "react";
import { Monitor, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">This page doesn't exist.</p>
        <div className="mt-6">
          <Link to="/" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-foreground">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Brokailabs · Unified Lead Inbox" },
      { name: "description", content: "The command center for high-volume dealmakers by Brokailabs." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "https://cdn.jsdelivr.net/npm/@tabler/icons/icons/outline/brain.svg" }
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [isMobileMode, setIsMobileMode] = useState(false);
  const [isIframe, setIsIframe] = useState(false);

  useEffect(() => {
    setIsIframe(window !== window.parent);
  }, []);

  const content = (
    <QueryClientProvider client={queryClient}>
      <CalendarProvider>
        <div className="flex h-[100dvh] w-full overflow-hidden bg-background text-foreground flex-col md:flex-row">
          <Sidebar />
          <div className="flex flex-1 overflow-hidden">
            <Outlet />
          </div>
        </div>
        <GoogleCalendarMock />
        <VoiceAgentWidget />
        <Toaster position="bottom-right" />
      </CalendarProvider>
    </QueryClientProvider>
  );

  return (
    <>
      {/* Dev Demo Toggle - Only show on desktop and not in iframe */}
      {!isIframe && (
        <div className="hidden md:flex fixed top-4 right-4 z-[100] items-center gap-1 rounded-full border border-border bg-background/80 p-1 backdrop-blur shadow-sm">
          <button
            onClick={() => setIsMobileMode(false)}
            className={cn(
              "p-1.5 rounded-full transition-colors flex items-center justify-center",
              !isMobileMode ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50"
            )}
            title="Desktop View"
          >
            <Monitor className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsMobileMode(true)}
            className={cn(
              "p-1.5 rounded-full transition-colors flex items-center justify-center",
              isMobileMode ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50"
            )}
            title="Mobile View"
          >
            <Smartphone className="h-4 w-4" />
          </button>
        </div>
      )}

      {isMobileMode && !isIframe ? (
        <div className="flex h-[100dvh] w-full items-center justify-center bg-slate-900 overflow-hidden">
          <div className="relative h-[844px] w-[390px] overflow-hidden rounded-[3rem] border-[8px] border-slate-800 shadow-2xl bg-white max-h-[95dvh]">
            <iframe src={window.location.href} className="w-full h-full border-none" title="Mobile Preview" />
          </div>
        </div>
      ) : (
        content
      )}
    </>
  );
}
