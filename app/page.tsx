import { AppSidebar } from "@/components/components/app-sidebar";
import { Sparkles, Star } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-[900px] h-[500px] bg-white border rounded-[15px] flex flex-col gap-3">
        <div className="flex gap-3">
          <Sparkles />
          Article Quiz Generator
        </div>
        <p className="text-[#71717A] font-normal text-[16px] font-">
          Paste your article below to generate a summarize and quiz question.
          Your articles will saved in the sidebar for future reference.
        </p>
      </div>
    </div>
  );
}
