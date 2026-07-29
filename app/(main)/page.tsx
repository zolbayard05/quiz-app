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
      toast.error("Алдаа гарлаа. Дахин оролдоно уу.");
      setLoading(false);
    }
  };

  const disabled = !title.trim() || !content.trim() || loading;

  return (
    <div className="mx-auto w-full max-w-[420px] rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Sparkles className="size-4" />
        <h1 className="font-semibold">Article Quiz Generator</h1>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-zinc-500">
        Paste your article below to generate a summarize and quiz question. Your
        articles will saved in the sidebar for future reference.
      </p>

      <div className="mt-4 space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs text-zinc-600">
          <Type className="size-3.5" />
          Article Title
        </div>
        <Input
          placeholder="Enter a title for your article..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-sm"
        />
      </div>

      <div className="mt-3 space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs text-zinc-600">
          <FileText className="size-3.5" />
          Article Content
        </div>
        <Textarea
          placeholder="Paste your article content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="h-32 resize-none text-sm"
        />
      </div>

      <div className="mt-4 flex justify-end">
        <Button size="sm" onClick={generate} disabled={disabled}>
          {loading ? "Generating..." : "Generate summary"}
        </Button>
      </div>
    </div>
  );
}
