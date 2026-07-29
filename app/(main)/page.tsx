"use client";

import { Sparkles } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const [title, setTitle] = useState("");

  const [content, setContent] = useState("");

  const [articles, setArticles] = useState<any[]>([]);

  const load = async () => {
    const { data } = await axios.get("/api/articles");

    setArticles(data);
  };

  useEffect(() => {
    load();
  }, []);
  const save = async () => {
    if (!title.trim() || !content.trim()) {
      alert("title aa bich durakaa");
      return;
    }
    try {
      await axios.post("/api/articles", { title, content });
      setTitle("");
      setContent("");
      load();
    } catch (e) {
      alert("adlaa garlaa");
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <input
        className="w-full rounded border p-2"
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="mt-3 h-40 w-full rounded border p-2"
        placeholder="Text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Button
        onClick={save}
        className="mt-3 rounded purple-700 px-4 py-2 text-white"
      >
        save
      </Button>
      <div className="mt-8 space-y-2">
        {articles.map((a) => (
          <Link key={a.id} href={`/article/${a.id}`}>
            <div className="rounded border p-3">
              <div className="font-medium">{a.title}</div>
              <div className="text-sm text-gray-500 line-clamp-2">
                {a.content}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
