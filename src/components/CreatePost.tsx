import { useState, useRef, type ChangeEvent, type DragEvent } from "react";
import { ImagePlus, X, Send } from "lucide-react";
import type { User } from "../types";

interface Props {
  currentUser: User;
  onSubmit: (content: string, image?: string) => void;
}

export default function CreatePost({ currentUser, onSubmit }: Props) {
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const MAX = 500;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (!content.trim() && !imagePreview) return;
    onSubmit(content.trim(), imagePreview ?? undefined);
    setContent("");
    setImagePreview(null);
  };

  const remaining = MAX - content.length;
  const canPost = (content.trim().length > 0 || imagePreview) && content.length <= MAX;

  return (
    <div className="bg-surface border border-white/[0.07] rounded-2xl p-5">
      <div className="flex gap-3">
        <img
          src={currentUser.avatar}
          alt={currentUser.fullName}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0 bg-rim"
        />
        <div className="flex-1 min-w-0">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={3}
            maxLength={MAX + 10}
            className="w-full bg-transparent text-ink placeholder-ghost text-sm leading-relaxed focus:outline-none"
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          />

          {imagePreview && (
            <div className="relative mt-3 rounded-xl overflow-hidden border border-white/10">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full max-h-72 object-cover"
              />
              <button
                onClick={() => setImagePreview(null)}
                className="absolute top-2 right-2 w-8 h-8 bg-base/80 backdrop-blur-sm rounded-full flex items-center justify-center text-ink hover:bg-base transition-colors border border-white/10"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {dragging && !imagePreview && (
            <div className="mt-3 border-2 border-dashed border-accent/40 rounded-xl p-6 text-center text-dim text-sm">
              Drop image here
            </div>
          )}

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.06]">
            <div className="flex items-center gap-1">
              <button
                onClick={() => fileRef.current?.click()}
                className="p-2 rounded-lg text-dim hover:text-accent hover:bg-accent/10 transition-all duration-150"
                title="Add image"
              >
                <ImagePlus size={18} />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div className="flex items-center gap-3">
              {content.length > 0 && (
                <span
                  className={`text-xs tabular-nums transition-colors ${
                    remaining < 20
                      ? remaining < 0
                        ? "text-heart"
                        : "text-star"
                      : "text-ghost"
                  }`}
                >
                  {remaining}
                </span>
              )}
              <button
                onClick={handleSubmit}
                disabled={!canPost}
                className="flex items-center gap-2 bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200"
              >
                <Send size={14} />
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
