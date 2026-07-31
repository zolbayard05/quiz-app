"use client";
import axios from "axios";
import { Sparkles, FileText, Type } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const generate = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/article", { title, content });
      await axios.post("/api/generate", { articleId: data.id });
      router.push(`/article/${data.id}`);
    } catch {
      toast.error("Aldaa garlaa dahiad neg uz dee.");
      setLoading(false);
    }
  };

  const disabled = !title.trim() || !content.trim() || loading;

  return (
    <div className="mx-auto w-full max-w-2xl rounded-[10px] border bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Sparkles className="size-5" />
        <h1 className="font-semibold text-2xl">Article Quiz Generator</h1>
      </div>
      <p className="mt-1 text-[16px] leading-relaxed text-zinc-500">
        Paste your article below to generate a summarize and quiz question. Your
        articles will saved in the sidebar for future reference.
      </p>

      <div className="mt-4 space-y-1.5">
        <div className="flex items-center gap-1.5 text-[14px] text-zinc-600">
          <Type className="size-3.5" />
          Article Title
        </div>
        <Input
          placeholder="Enter a title for your article..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-sm rounded-[8px]"
        />
      </div>

      <div className="mt-3 space-y-1.5">
        <div className="flex items-center gap-1.5 text-[14px] text-zinc-600">
          <FileText className="size-3.5" />
          Article Content
        </div>
        <Textarea
          placeholder="Paste your article content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="h-50 resize-none text-sm rounded-[8px]"
        />
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          size="lg"
          onClick={generate}
          disabled={disabled}
          className="rounded-[10px]"
        >
          {loading ? "Generating..." : "Generate summary"}
        </Button>
      </div>
    </div>
  );
}
