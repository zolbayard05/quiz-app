"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { use, useEffect, useState } from "react";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    axios.get(`/api/articles/${id}`).then((r) => setArticle(r.data));
  }, [id]);

  const summarize = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/generate", { articleId: id });
      setArticle(data);
    } catch {
      alert("summarize hiih uyd aldaa garlaa");
    }
    setLoading(false);
  };

  const createQuiz = async () => {
    alert("udahgui hiine");
  };

  if (!article) return <div className="p-6">achaalj baina...</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold">{article.title}</h1>

      {article.summary ? (
        <>
          <div className="mt-4 rounded border bg-gray-50 p-4">
            <div className="mb-2 text-sm font-medium text-gray-500">
              Summary
            </div>
            {article.summary}
          </div>

          <div>
            <Button onClick={createQuiz}>take quiz</Button>
            <Button
              variant="outline"
              onClick={() => setShowContent(!showContent)}
            >
              see content
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
          {loading ? "summrize hiij baina..." : "summarize"}
        </Button>
      )}
    </div>
  );
}
