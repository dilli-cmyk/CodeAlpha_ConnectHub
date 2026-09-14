import { useState, useRef, type FormEvent, type ChangeEvent } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  Check,
  Send,
  ImagePlus,
} from "lucide-react";
import type { Post, User, Comment, AppHandlers } from "../types";
import { formatTime, generateId } from "../utils/helpers";

interface Props {
  key?: string;
  post: Post;
  author: User;
  currentUser: User;
  allUsers: User[];
  handlers: AppHandlers;
}

export default function PostCard({ post, author, currentUser, allUsers, handlers }: Props) {
  const [liked, setLiked] = useState(post.likes.includes(currentUser.id));
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [likeAnim, setLikeAnim] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [newComment, setNewComment] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editImage, setEditImage] = useState(post.image);
  const [editImagePreview, setEditImagePreview] = useState<string | undefined>(post.image);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const isOwn = post.userId === currentUser.id;

  const handleLike = () => {
    const next = !liked;
    setLiked(next);
    setLikeCount((c) => c + (next ? 1 : -1));
    if (next) {
      setLikeAnim(true);
      setTimeout(() => setLikeAnim(false), 400);
    }
    handlers.onLikePost(post.id);
  };

  const handleComment = (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const c: Comment = {
      id: generateId(),
      userId: currentUser.id,
      content: newComment.trim(),
      createdAt: new Date().toISOString(),
      likes: [],
    };
    setComments((prev) => [...prev, c]);
    handlers.onCommentPost(post.id, newComment.trim());
    setNewComment("");
  };

  const handleEditSave = () => {
    if (!editContent.trim() && !editImagePreview) return;
    handlers.onEditPost(post.id, editContent.trim(), editImagePreview);
    setIsEditing(false);
    setMenuOpen(false);
  };

  const handleEditFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditImagePreview(URL.createObjectURL(file));
    setEditImage(undefined);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      handlers.onShowToast("Link copied to clipboard");
    } catch {
      handlers.onShowToast("Share link copied");
    }
  };

  const getUser = (id: string) => allUsers.find((u) => u.id === id);

  return (
    <article className="bg-surface border border-white/[0.07] rounded-2xl overflow-hidden hover:border-white/[0.12] transition-all duration-200 animate-fade-up">
      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-5 pb-3">
        <button
          onClick={() => handlers.onNavigate("profile", author.id)}
          className="flex items-center gap-3 group"
        >
          <img
            src={author.avatar}
            alt={author.fullName}
            className="w-10 h-10 rounded-full object-cover bg-rim group-hover:ring-2 group-hover:ring-accent/40 transition-all duration-200"
          />
          <div className="text-left">
            <p className="text-ink text-sm font-semibold leading-tight group-hover:text-accent transition-colors">
              {author.fullName}
            </p>
            <p className="text-ghost text-xs">
              @{author.username} · {formatTime(post.createdAt)}
              {post.edited && (
                <span className="ml-1.5 text-ghost/60">· edited</span>
              )}
            </p>
          </div>
        </button>

        <div className="relative">
          {isOwn && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg text-ghost hover:text-dim hover:bg-white/5 transition-all"
            >
              <MoreHorizontal size={18} />
            </button>
          )}
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 bg-lift border border-white/10 rounded-xl shadow-2xl w-40 z-20 overflow-hidden animate-slide-in">
              <button
                onClick={() => { setIsEditing(true); setMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-dim hover:text-ink hover:bg-white/5 text-sm transition-colors"
              >
                <Pencil size={14} /> Edit post
              </button>
              <button
                onClick={() => { setShowDeleteConfirm(true); setMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-heart hover:bg-heart/10 text-sm transition-colors"
              >
                <Trash2 size={14} /> Delete post
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirm */}
      {showDeleteConfirm && (
        <div className="mx-5 mb-3 bg-heart/10 border border-heart/20 rounded-xl p-4">
          <p className="text-ink text-sm font-medium mb-3">Delete this post?</p>
          <div className="flex gap-2">
            <button
              onClick={() => { handlers.onDeletePost(post.id); setShowDeleteConfirm(false); }}
              className="flex-1 bg-heart hover:bg-heart/80 text-white text-sm font-medium py-2 rounded-lg transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 border border-white/10 text-dim hover:text-ink text-sm py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-5 pb-3">
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={4}
              className="w-full bg-lift border border-white/10 rounded-xl px-3 py-2.5 text-ink text-sm leading-relaxed focus:outline-none focus:border-accent/40 transition-colors"
            />
            {editImagePreview && (
              <div className="relative rounded-xl overflow-hidden border border-white/10">
                <img src={editImagePreview} alt="" className="w-full max-h-60 object-cover" />
                <button
                  onClick={() => { setEditImagePreview(undefined); setEditImage(undefined); }}
                  className="absolute top-2 right-2 w-7 h-7 bg-base/80 rounded-full flex items-center justify-center text-ink border border-white/10"
                >
                  <X size={12} />
                </button>
              </div>
            )}
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileRef.current?.click()}
                className="p-2 rounded-lg text-dim hover:text-accent hover:bg-accent/10 transition-all"
              >
                <ImagePlus size={16} />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleEditFileChange} />
              <div className="flex-1" />
              <button
                onClick={() => { setIsEditing(false); setEditContent(post.content); setEditImagePreview(post.image); }}
                className="p-2 rounded-lg text-ghost hover:text-dim"
              >
                <X size={16} />
              </button>
              <button
                onClick={handleEditSave}
                className="flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
              >
                <Check size={14} /> Save
              </button>
            </div>
          </div>
        ) : (
          <p className="text-ink text-sm leading-relaxed whitespace-pre-line">{post.content}</p>
        )}
      </div>

      {/* Image */}
      {!isEditing && (editImagePreview || post.image) && (
        <div className="px-5 pb-3">
          <img
            src={editImagePreview ?? post.image}
            alt="Post"
            className="w-full rounded-xl object-cover max-h-96 bg-lift"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 px-4 py-2 border-t border-white/[0.05]">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
            liked
              ? "text-heart bg-heart/10"
              : "text-dim hover:text-heart hover:bg-heart/10"
          }`}
        >
          <Heart
            size={17}
            className={`${likeAnim ? "animate-heart-pop" : ""} transition-transform`}
            fill={liked ? "currentColor" : "none"}
          />
          <span className="text-xs tabular-nums">{likeCount}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
            showComments ? "text-accent bg-accent/10" : "text-dim hover:text-accent hover:bg-accent/10"
          }`}
        >
          <MessageCircle size={17} />
          <span className="text-xs tabular-nums">{comments.length}</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-dim hover:text-teal hover:bg-teal/10 text-sm font-medium transition-all duration-150"
        >
          <Share2 size={17} />
        </button>

        <div className="flex-1" />

        <button
          onClick={() => setBookmarked(!bookmarked)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all duration-150 ${
            bookmarked ? "text-star bg-star/10" : "text-dim hover:text-star hover:bg-star/10"
          }`}
        >
          <Bookmark size={17} fill={bookmarked ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="border-t border-white/[0.05] px-5 pt-4 pb-5 space-y-4">
          {comments.map((c) => {
            const commentAuthor = getUser(c.userId);
            if (!commentAuthor) return null;
            return (
              <div key={c.id} className="flex gap-3">
                <button onClick={() => handlers.onNavigate("profile", commentAuthor.id)}>
                  <img
                    src={commentAuthor.avatar}
                    alt={commentAuthor.fullName}
                    className="w-8 h-8 rounded-full object-cover bg-rim flex-shrink-0"
                  />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="bg-lift rounded-xl px-3 py-2.5">
                    <button
                      onClick={() => handlers.onNavigate("profile", commentAuthor.id)}
                      className="text-ink text-xs font-semibold hover:text-accent transition-colors"
                    >
                      {commentAuthor.fullName}
                    </button>
                    <p className="text-dim text-sm mt-0.5 leading-relaxed">{c.content}</p>
                  </div>
                  <p className="text-ghost text-xs mt-1 pl-3">{formatTime(c.createdAt)}</p>
                </div>
              </div>
            );
          })}

          <form onSubmit={handleComment} className="flex gap-3 mt-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.fullName}
              className="w-8 h-8 rounded-full object-cover bg-rim flex-shrink-0"
            />
            <div className="flex-1 flex items-center gap-2 bg-lift border border-white/[0.07] rounded-xl px-3 py-2 focus-within:border-accent/40 transition-colors">
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment…"
                className="flex-1 bg-transparent text-ink text-sm placeholder-ghost focus:outline-none"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="text-accent disabled:text-ghost transition-colors flex-shrink-0"
              >
                <Send size={15} />
              </button>
            </div>
          </form>
        </div>
      )}
    </article>
  );
}
