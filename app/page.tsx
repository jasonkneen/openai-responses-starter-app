"use client";
import Assistant from "@/components/assistant";
import ToolsPanel from "@/components/tools-panel";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useConversationStore from "@/stores/useConversationStore";

export default function Main() {
  const [isToolsPanelOpen, setIsToolsPanelOpen] = useState(false);
  const router = useRouter();
  const { resetConversation } = useConversationStore();

  // After OAuth redirect, reinitialize the conversation so the next turn
  // uses the connector-enabled server configuration immediately
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isConnected = new URLSearchParams(window.location.search).get("connected");
    if (isConnected === "1") {
      resetConversation();
      router.replace("/", { scroll: false });
    }
  }, [router, resetConversation]);

  return (
    <div className="flex justify-center h-screen">
      <div className="w-full md:w-[70%]">
        <Assistant />
      </div>
      <div className="hidden md:block w-[30%]">
        <ToolsPanel />
      </div>
      {/* Theme toggle and menu for all screens */}
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <ThemeToggle />
        <button type="button" onClick={() => setIsToolsPanelOpen(true)} aria-label="Open tools panel" className="md:hidden">
          <Menu size={24} />
        </button>
      </div>
      {/* Overlay panel for ToolsPanel on small screens */}
      {isToolsPanelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30 dark:bg-black/50">
          <div className="w-full bg-card h-full p-4 text-card-foreground">
            <button type="button" className="mb-4" onClick={() => setIsToolsPanelOpen(false)} aria-label="Close tools panel">
              <X size={24} />
            </button>
            <ToolsPanel />
          </div>
        </div>
      )}
    </div>
  );
}
