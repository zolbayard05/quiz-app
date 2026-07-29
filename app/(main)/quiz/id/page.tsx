"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function QuizPage() {
  const { id } = useParams<{ id: string }>();
  const [questions, setQuestions] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    axios.get(`/api/quiz/${id}`).then((r) => setQuestions(r.data));
  }, [id]);

  const submit = async () => {
    const { data } = await axios.post(`/api/quiz/${id}/attempts`, { answers });
    setResult(data);
  };

  if (result) {
    return (
      <div className="mx-auto w-full max-w-2xl p-6">
        <h1 className="text-2xl font-semibold">
          score: {result.score} / {result.total}
        </h1>
        <div className="mt-6 space-y-4">
          {result.detail.map((d: any, i: number) => (
            <div key={d.id} className="rounded border p-4">
              <div className="font-medium">
                {i + 1}. {d.question}
              </div>
              <div
                className={`mt-2 text-sm ${d.correct ? "text-green-600" : "text-red-600"}`}
              >
                your answer: {d.options[d.userAnswer] ?? "—"}
              </div>
              {!d.correct && (
                <div className="text-sm text-green-600">
                  correct answer: {d.options[d.correctAnswer]}
                </div>
              )}
            </div>
          ))}
        </div>
        <Button
          className="mt-6"
          onClick={() => {
            setResult(null);
            setAnswers({});
            setCurrent(0);
          }}
        >
          restart quiz
        </Button>
      </div>
    );
  }

  if (!questions.length) return <div className="p-6">rendering...</div>;

  const q = questions[current];
  const isLast = current === questions.length - 1;

  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <div className="text-sm text-gray-500">
        {current + 1} / {questions.length}
      </div>
      <h2 className="mt-2 text-xl font-medium">{q.question}</h2>

      <div className="mt-4 space-y-2">
        {q.options.map((opt: string, i: number) => (
          <button
            key={i}
            onClick={() => setAnswers({ ...answers, [q.id]: i })}
            className={`block w-full rounded border p-3 text-left ${
              answers[q.id] === i ? "border-purple-600 bg-purple-50" : ""
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        {current > 0 && (
          <Button variant="outline" onClick={() => setCurrent(current - 1)}>
            back
          </Button>
        )}
        {isLast ? (
          <Button
            onClick={submit}
            disabled={Object.keys(answers).length < questions.length}
          >
            finish
          </Button>
        ) : (
          <Button
            onClick={() => setCurrent(current + 1)}
            disabled={answers[q.id] === undefined}
          >
            next
          </Button>
        )}
      </div>
    </div>
  );
}
