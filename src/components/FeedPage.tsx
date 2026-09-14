import { useState } from "react";
import type { Post, User, AppHandlers } from "../types";
import CreatePost from "./CreatePost";
import PostCard from "./PostCard";

interface Props {
  currentUser: User;
  posts: Post[];
  users: User[];
  handlers: AppHandlers;
}

type Filter = "for-you" | "following";

export default function FeedPage({ currentUser, posts, users, handlers }: Props) {
  const [filter, setFilter] = useState<Filter>("for-you");

  const getUser = (id: string) => users.find((u) => u.id === id);

  const feedPosts = posts
    .filter((p) => {
      if (filter === "for-you") return true;
      return (
        p.userId === currentUser.id || currentUser.following.includes(p.userId)
      );
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="max-w-[600px] mx-auto w-full">
      {/* Filter tabs */}
      <div className="flex border-b border-white/[0.07] mb-6 sticky top-0 bg-base/95 backdrop-blur-sm z-10 -mx-1 px-1">
        {(["for-you", "following"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-3.5 text-sm font-medium transition-all duration-200 relative ${
              filter === f ? "text-ink" : "text-ghost hover:text-dim"
            }`}
          >
            {f === "for-you" ? "For You" : "Following"}
            {filter === f && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-accent rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <CreatePost currentUser={currentUser} onSubmit={handlers.onCreatePost} />

        {feedPosts.length === 0 ? (
          <div className="text-center py-16 text-ghost">
            <p className="text-2xl mb-2">✦</p>
            <p className="font-medium text-dim">Nothing here yet.</p>
            <p className="text-sm mt-1">
              {filter === "following"
                ? "Follow more people to see their posts."
                : "Be the first to post something."}
            </p>
          </div>
        ) : (
          feedPosts.map((post) => {
            const author = getUser(post.userId);
            if (!author) return null;
            return (
              <PostCard
                key={post.id}
                post={post}
                author={author}
                currentUser={currentUser}
                allUsers={users}
                handlers={handlers}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
