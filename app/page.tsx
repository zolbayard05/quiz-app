import { Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex w-[900px] h-[500px] flex-col gap-3 rounded-[15px] border bg-white">
        <div className="flex gap-3">
          <Sparkles />
          Article Quiz Generator
        </div>
        <p className="text-[16px] font-normal text-[#71717A]">
          Paste your article below to generate a summarize and quiz question.
          Your articles will saved in the sidebar for future reference.
        </p>
      </div>
    </div>
  );
}
