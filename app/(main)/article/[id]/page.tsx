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
      <div className="mx-auto w-full max-w-[420px] space-y-3">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="mb-3 size-7"
        onClick={() => router.push("/")}
      >
        <ChevronLeft className="size-4" />
      </Button>

      <div className="mx-auto w-full max-w-[420px] rounded-xl border bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4" />
          <h1 className="font-semibold">Article Quiz Generator</h1>
        </div>

        <div className="mt-4 flex items-center gap-1.5 text-xs text-zinc-600">
          <BookOpen className="size-3.5" />
          Summarized content
        </div>

        <h2 className="mt-2 text-lg font-semibold">{article.title}</h2>
        <p className="mt-2 text-xs leading-relaxed text-zinc-700">
          {article.summary}
        </p>

        <div className="mt-5 flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
            See content
          </Button>
          <Button size="sm" onClick={takeQuiz} disabled={loading}>
            {loading ? "Creating..." : "Take a quiz"}
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[80svh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{article.title}</DialogTitle>
          </DialogHeader>
          <p className="whitespace-pre-wrap text-xs leading-relaxed text-zinc-700">
            {article.content}
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
