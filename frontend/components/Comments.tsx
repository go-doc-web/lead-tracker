"use client";

import { useState } from "react";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { Comment } from "@/types/lead";
import { leadsApi } from "@/api/leads";

interface Props {
  leadId: string;
  initialComments: Comment[];
}

export default function Comments({ leadId, initialComments }: Props) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [text, setText] = useState("");
  const [issubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || issubmitting) return;

    try {
      setIsSubmitting(true);

      const newComment = await leadsApi.addComment(leadId, text);

      setComments([newComment, ...comments]);
      setText(""); // Очищаємо поле
    } catch (err) {
      alert("Не вдалося надіслати коментар");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
      <h3 className="text-xl font-bold flex items-center gap-2">
        <MessageSquare size={20} className="text-blue-500" />
        Коментарі
      </h3>

      {/* ФОРМА ДОДАВАННЯ */}
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Напишіть щось важливе про цього клієнта..."
          className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all resize-none"
        />
        <button
          type="submit"
          disabled={issubmitting || !text.trim()}
          className="absolute right-3 bottom-3 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-slate-300 transition-colors shadow-lg shadow-blue-200"
        >
          {issubmitting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={18} />
          )}
        </button>
      </form>

      {/* СПИСОК (Timeline) */}
      <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="relative pl-8 animate-in fade-in slide-in-from-top-2 duration-300"
            >
              <div className="absolute left-0 top-1.5 w-[24px] h-[24px] bg-white border-4 border-blue-500 rounded-full z-10 shadow-sm" />
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 group hover:border-slate-200 transition-colors">
                <p className="text-slate-900 text-sm leading-relaxed whitespace-pre-wrap">
                  {comment.text}
                </p>
                <div className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                  {new Date(comment.createdAt).toLocaleString("uk-UA", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-slate-400 text-sm pl-8 italic">
            Коментарів поки немає...
          </p>
        )}
      </div>
    </div>
  );
}
