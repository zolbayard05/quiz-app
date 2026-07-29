import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/components/app-sidebar";

import { UserButton } from "@clerk/nextjs";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex justify-between border-b w-full p-3">
        <div className="text-2xl font-semibold">Quiz app</div>
        <UserButton />
      </div>
      <SidebarProvider>
        <div className="flex min-h-svh w-full">
          <AppSidebar />
          <SidebarInset>
            <div className="flex h-12 items-center border-b bg-sidebar px-2">
              <SidebarTrigger />
            </div>
            <div className="flex flex-1 flex-col">{children}</div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </>
  );
}
