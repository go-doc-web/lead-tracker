"use client";

import { useState } from "react";
import { leadsApi } from "@/api/leads";
import { MessageSquare, Send, User } from "lucide-react";

interface Comment {
  id: string;
  text: string;
  createdAt: string;
}

interface Props {
  leadId: string;
  initialComments: Comment[];
}

export default function Comments({ leadId, initialComments }: Props) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      // Предполагаем, что в leadsApi есть метод addComment
      const addedComment = await leadsApi.addComment(leadId, newComment);

      // Добавляем новый комментарий в начало списка
      setComments([addedComment, ...comments]);
      setNewComment("");
    } catch (err) {
      alert("Не вдалося додати коментар");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-[40px] p-8 sm:p-10 border border-slate-200 shadow-sm mt-8">
      <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 mb-8 flex items-center gap-3">
        <MessageSquare size={18} className="text-blue-500" />
        Коментарі ({comments.length})
      </h3>

      {/* Форма додавання */}
      <form onSubmit={handleSubmit} className="mb-10 relative">
        <textarea
          className="w-full bg-slate-50 rounded-[24px] p-6 pr-16 text-sm text-slate-700 outline-none border border-transparent focus:border-blue-100 transition-all min-h-[100px] resize-none font-medium"
          placeholder="Напишіть щось важливе про цього клієнта..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          type="submit"
          disabled={!newComment.trim() || isSubmitting}
          className="absolute right-4 bottom-4 p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-30 transition-all shadow-lg shadow-blue-100"
        >
          <Send size={18} />
        </button>
      </form>

      {/* Список коментарів */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-center text-slate-400 text-sm py-4">
            Ще немає жодного коментаря
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                <User size={18} className="text-slate-400" />
              </div>
              <div className="flex-1 bg-slate-50/50 rounded-[24px] p-5 border border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    Менеджер
                  </span>
                  <span className="text-[10px] font-bold text-slate-300">
                    {new Date(comment.createdAt).toLocaleString("uk-UA", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  {comment.text}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
