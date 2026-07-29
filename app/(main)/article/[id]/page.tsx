"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    axios.get(`/api/article/${id}`).then((r) => setArticle(r.data));
  }, [id]);

  const summarize = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/generate", { articleId: id });
      setArticle(data);
    } catch {
      alert("summarize hiihed aldaa garlaa");
    }
    setLoading(false);
  };

  const createQuiz = async () => {
    setQuizLoading(true);
    try {
      const { data } = await axios.post(`/api/article/${id}/quizzes`);
      router.push(`/quiz/${data.quizId}`);
    } catch {
      alert("quiz uusgehd aldaa garlaa");
      setQuizLoading(false);
    }
  };

  if (!article) return <div className="p-6">rendering...</div>;

  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <h1 className="text-2xl font-semibold">{article.title}</h1>

      {article.summary ? (
        <>
          <div className="mt-4 rounded border bg-gray-50 p-4">
            <div className="mb-2 text-sm font-medium text-gray-500">
              Summary
            </div>
            {article.summary}
          </div>

          <div className="mt-4 flex gap-3">
            <Button onClick={createQuiz} disabled={quizLoading}>
              {quizLoading ? " Quiz generaring..." : "Take quiz"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowContent(!showContent)}
            >
              See content
            </Button>
          </div>

          {showContent && (
            <div className="mt-4 whitespace-pre-wrap text-sm text-gray-700">
              {article.content}
            </div>
          )}
        </>
      ) : (
        <Button onClick={summarize} disabled={loading} className="mt-4">
          {loading ? "summarzing..." : "summarize"}
        </Button>
      )}
    </div>
  );
}
