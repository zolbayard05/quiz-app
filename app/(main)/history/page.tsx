"use client";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HistoryPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/history").then((r) => {
      setRows(r.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-6">rendering...</div>;

  if (!rows.length) {
    return <div className="p-6 text-gray-500">no history.</div>;
  }

  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <h1 className="text-2xl font-semibold">history</h1>

      <div className="mt-6 space-y-3">
        {rows.map((r) => (
          <div
            key={`${r.article_id}-${r.quiz_id}`}
            className="rounded border p-4"
          >
            <Link href={`/article/${r.article_id}`}>
              <div className="font-medium hover:underline">{r.title}</div>
            </Link>

            <div className="mt-1 text-xs text-gray-500">
              {new Date(r.created_at).toLocaleDateString("mn-MN")}
            </div>

            {r.summary && (
              <div className="mt-2 line-clamp-2 text-sm text-gray-600">
                {r.summary}
              </div>
            )}

            <div className="mt-3 flex items-center gap-4 text-sm">
              {r.quiz_id ? (
                <>
                  <span className="text-gray-600">
                    Оролдлого: {r.attempt_count}
                  </span>
                  {r.best_score !== null && (
                    <span className="font-medium text-green-600">
                      Дээд оноо: {r.best_score} / 5
                    </span>
                  )}
                  <Link
                    href={`/quiz/${r.quiz_id}`}
                    className="ml-auto text-purple-700 hover:underline"
                  >
                    Дахин өгөх
                  </Link>
                </>
              ) : (
                <span className="text-gray-400">Quiz үүсгээгүй</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
