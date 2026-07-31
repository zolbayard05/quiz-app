"use client";
import axios from "axios";
import { Sparkles, BookOpen, ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [article, setArticle] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`/api/article/${id}`).then((r) => setArticle(r.data));
  }, [id]);

  const takeQuiz = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`/api/article/${id}/quizzes`);
      router.push(`/quiz/${data.quizId}`);
    } catch {
      toast.error("quiz uusgehed aldaa garlaa");
      setLoading(false);
    }
  };

  if (!article) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-3">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl flex flex-col gap-4">
      <Button
        variant="outline"
        size="icon"
        className="mb-3 size-7 rounded-[8px] h-10 w-10"
        onClick={() => router.push("/")}
      >
        <ChevronLeft className="size-4" />
      </Button>

      <div className="mx-auto w-full max-w-2xl rounded-[10px] border bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4" />
          <h1 className="font-semibold text-2xl">Article Quiz Generator</h1>
        </div>

        <div className="mt-4 flex items-center gap-1.5 text-[14px] text-zinc-600">
          <BookOpen className="size-3.5" />
          Summarized content
        </div>

        <h2 className="mt-2 text-xl font-semibold">{article.title}</h2>
        <p className="mt-2 text-[14px] leading-relaxed text-zinc-700">
          {article.summary}
        </p>

        <div className="mt-5 flex items-center justify-between">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setOpen(true)}
            className="rounded-[10px]"
          >
            See content
          </Button>
          <Button
            size="lg"
            onClick={takeQuiz}
            disabled={loading}
            className="rounded-[10px]"
          >
            {loading ? "Creating..." : "Take a quiz"}
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[80svh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">{article.title}</DialogTitle>
          </DialogHeader>
          <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-zinc-700">
            {article.content}
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
