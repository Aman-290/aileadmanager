import { useState, useEffect } from "react";
import { RetellWebClient } from "retell-client-js-sdk";
import { Mic, MicOff, PhoneCall, PhoneOff, Loader2, X } from "lucide-react";
import { getRetellAccessToken } from "@/lib/retell-api";
import { cn } from "@/lib/utils";

// Initialize the client once outside component to manage state properly
const retellWebClient = new RetellWebClient();

export function VoiceAgentWidget() {
  const [isCalling, setIsCalling] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Add event listeners for conversation status
    retellWebClient.on("call_started", () => {
      setIsCalling(true);
      setIsConnecting(false);
      console.log("Call started");
    });
    
    retellWebClient.on("call_ended", () => {
      setIsCalling(false);
      setIsConnecting(false);
      console.log("Call ended");
    });
    
    retellWebClient.on("error", (error) => {
      console.error("Retell error:", error);
      setIsCalling(false);
      setIsConnecting(false);
    });

    // Fallbacks for the user-provided SDK events in case of different SDK versions
    retellWebClient.on("conversationStarted" as any, () => {
      setIsCalling(true);
      setIsConnecting(false);
    });
    
    retellWebClient.on("conversationEnded" as any, () => {
      setIsCalling(false);
      setIsConnecting(false);
    });

    return () => {
      retellWebClient.removeAllListeners();
    };
  }, []);

  const startConversation = async () => {
    setIsConnecting(true);
    try {
      // Call our Next.js API route / Server function to get the access token securely
      const { accessToken } = await getRetellAccessToken();
      
      // Start the call
      await retellWebClient.startCall({ accessToken });
    } catch (error) {
      console.error("Failed to start call:", error);
      setIsConnecting(false);
    }
  };

  const stopConversation = () => {
    retellWebClient.stopCall();
    setIsCalling(false);
  };

  return (
    <>
      {/* Backdrop overlay — click to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[59] bg-black/30 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out panel */}
      <div
        className={cn(
          "fixed right-0 top-0 bottom-0 z-[60] w-80 bg-card border-l border-border shadow-2xl transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full bg-background">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-primary" />
              Demo Voice Agent
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              title="Close panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-6 flex flex-col items-center justify-center space-y-8">
            <div className="text-center space-y-2">
              <h3 className="font-medium text-lg text-foreground">AiLeadManager Assistant</h3>
              <p className="text-sm text-muted-foreground">Talk to our AI agent directly from your browser.</p>
            </div>

            <div className={cn(
              "w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300",
              isCalling ? "bg-primary/20 ring-4 ring-primary/50 animate-pulse" : "bg-muted",
              isConnecting ? "animate-pulse bg-muted" : ""
            )}>
              {isCalling ? (
                <Mic className="w-12 h-12 text-primary" />
              ) : (
                <MicOff className="w-12 h-12 text-muted-foreground" />
              )}
            </div>

            <div className="w-full pt-6">
              {!isCalling ? (
                <button
                  disabled={isConnecting}
                  onClick={startConversation}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <PhoneCall className="w-5 h-5" />
                      Start Conversation
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={stopConversation}
                  className="w-full flex items-center justify-center gap-2 bg-destructive text-destructive-foreground py-3 rounded-lg font-medium hover:bg-destructive/90 transition-colors"
                >
                  <PhoneOff className="w-5 h-5" />
                  Stop Conversation
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button — always visible, toggles panel */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "fixed bottom-6 right-6 z-[61] p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 group",
          isOpen
            ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        )}
        title={isOpen ? "Close Voice Agent" : "Open Voice Agent Demo"}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <PhoneCall className="w-6 h-6 group-hover:animate-pulse" />
        )}
      </button>
    </>
  );
}
