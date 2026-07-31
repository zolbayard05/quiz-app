"use client";

import * as React from "react";
import axios from "axios";
import { useRouter, usePathname, useParams } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

type Article = { id: number; title: string };

export function AppSidebar() {
  const [history, setHistory] = React.useState<Article[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ id?: string }>();

  React.useEffect(() => {
    axios
      .get("/api/article")
      .then((r) => setHistory(r.data))
      .catch(() => setHistory([]));
  }, [pathname]);

  return (
    <Sidebar className="top-14 h-[calc(100svh-3.5rem)] border-r bg-white">
      <SidebarHeader className="flex flex-row items-center justify-between px-4 py-3">
        <span className="text-2xl font-medium mt-4">History</span>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="py-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {history.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={params.id === String(item.id)}
                    onClick={() => router.push(`/article/${item.id}`)}
                    className="h-auto whitespace-normal py-2 text-[16px] leading-snug text-zinc-700"
                  >
                    {item.title}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
