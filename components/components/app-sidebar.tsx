"use client";

import * as React from "react";
import { X } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export type HistoryItem = {
  id: string;
  title: string;
};

const MOCK_HISTORY: HistoryItem[] = [
  { id: "1", title: "React hooks" },
  { id: "2", title: "mongolian history" },
  { id: "3", title: "genghis khan" },
  { id: "4", title: "math quiz" },
  { id: "5", title: "SQL" },
];

export function AppSidebar() {
  const [history, setHistory] = React.useState<HistoryItem[]>(MOCK_HISTORY);
  const [activeId, setActiveId] = React.useState<string>(MOCK_HISTORY[0]?.id);

  return (
    <Sidebar className="mt-14">
      <SidebarHeader>
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-zinc-900 hover:bg-zinc-100 transition-colors font-semibold"
          onClick={() => {}}
        >
          History
        </button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroupContent>
          <SidebarMenu>
            {history.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  isActive={item.id === activeId}
                  onClick={() => setActiveId(item.id)}
                >
                  <span className="truncate">{item.title}</span>
                </SidebarMenuButton>
                <SidebarMenuAction
                  showOnHover
                  onClick={() => {
                    setHistory((prev) => prev.filter((h) => h.id !== item.id));
                  }}
                >
                  <X />
                </SidebarMenuAction>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
        {history.length === 0 && (
          <div className="px-3 py-6 text-center text-sm text-zinc-400">
            no history
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
