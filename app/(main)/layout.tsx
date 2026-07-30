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
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b bg-white px-5">
        <div className="text-3xl font-semibold">Quiz app</div>
        <UserButton />
      </header>

      <SidebarProvider className="min-h-0 flex-1 items-start">
        <AppSidebar />
        <SidebarInset className="bg-zinc-50">
          <div className="p-3">
            <SidebarTrigger className="text-zinc-400" />
          </div>
          <div className="flex flex-1 flex-col px-4 pb-10">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
