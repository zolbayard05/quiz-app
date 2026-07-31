"use client";
import axios from "axios";
import {
  Sparkles,
  X,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Bookmark,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function QuizPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<any>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    axios.get(`/api/quiz/${id}`).then((r) => setQuestions(r.data));
  }, [id]);

  const restart = () => {
    setResult(null);
    setAnswers({});
    setCurrent(0);
  };

  const choose = async (optionIndex: number) => {
    const q = questions[current];
    const next = { ...answers, [q.id]: optionIndex };
    setAnswers(next);

    if (current < questions.length - 1) {
      setCurrent(current + 1);
      return;
    }
    try {
      const { data } = await axios.post(`/api/quiz/${id}/attempts`, {
        answers: next,
      });
      setResult(data);
    } catch {
      toast.error("Илгээхэд алдаа гарлаа");
    }
  };

  if (result) {
    return (
      <div className="mx-auto w-full max-w-2xl flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5" />
          <h1 className="font-semibold text-2xl">Quiz completed</h1>
        </div>
        <p className="mt-1 text-[16px] text-zinc-500">
          Let&apos;s see what you did
        </p>

        <div className="mt-6 rounded-[10px] border bg-white p-5 shadow-sm">
          <div className="text-lg font-semibold">
            Your score: {result.score}{" "}
            <span className="text-[16px] font-normal text-zinc-400">
              / {result.total}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {result.detail.map((d: any, i: number) => (
              <div key={d.id} className="flex gap-2">
                {d.correct ? (
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-600" />
                ) : (
                  <XCircle className="mt-0.5 size-4 shrink-0 text-red-500" />
                )}
                <div className="text-[14px] leading-relaxed">
                  <div className="text-zinc-500">
                    {i + 1}. {d.question}
                  </div>
                  <div className="text-zinc-900">
                    Your answer: {d.options[d.userAnswer] ?? "—"}
                  </div>
                  {!d.correct && (
                    <div className="text-green-600">
                      Correct: {d.options[d.correctAnswer]}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex gap-5 justify-center">
            <Button
              variant="outline"
              size="lg"
              className=" w-50 rounded-[10px] p-5"
              onClick={restart}
            >
              <RotateCcw className="size-3.5" />
              Restart quiz
            </Button>
            <Button
              size="lg"
              className=" w-50 rounded-[10px] p-5"
              onClick={() => router.push("/")}
            >
              <Bookmark className="size-3.5" />
              Save and leave
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return <Skeleton className="mx-auto h-40 w-full max-w-2xl" />;
  }

  const q = questions[current];

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="size-4" />
            <h1 className="font-semibold text-2xl">Quick test</h1>
          </div>
          <p className="mt-1 text-[16px] text-zinc-500">
            Take a quick test about your knowledge from your content
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="size-7 rounded-[8px] h-10 w-10"
          onClick={() => setConfirmOpen(true)}
        >
          <X className="size-3.5" />
        </Button>
      </div>

      <div className="mt-5 rounded-[10px] border bg-white p-4 shadow-sm h-70">
        <div className="flex justify-between items-center mt-5">
          <div className="text-[16px] font-medium">{q.question}</div>
          <div className="shrink-0 text-sm font-semibold">
            {current + 1}
            <span className="font-normal text-zinc-400">
              {" "}
              / {questions.length}
            </span>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4">
          {q.options.map((opt: string, i: number) => (
            <button
              key={i}
              onClick={() => choose(i)}
              className="rounded-[8px] border px-3 py-2 text-center text-[14px] transition-colors hover:border-zinc-900 hover:bg-zinc-50 h-15"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="sm:max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-red-400 text-[14px]]">
              If you press &apos;Cancel&apos;, this quiz will restart from the
              beginning.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2 sm:justify-start">
            <AlertDialogCancel className="mt-0 flex-1 bg-zinc-900 text-white hover:bg-zinc-800 hover:text-white rounded-[10px]">
              Go back
            </AlertDialogCancel>
            <AlertDialogAction
              className="flex-1 border bg-white text-zinc-900 hover:bg-zinc-50 rounded-[10px]"
              onClick={() => router.push("/")}
            >
              Cancel quiz
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
