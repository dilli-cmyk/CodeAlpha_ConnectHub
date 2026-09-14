import { useState } from "react";
import { Search, UserPlus, UserCheck } from "lucide-react";
import type { User, AppHandlers } from "../types";

interface Props {
  currentUser: User;
  users: User[];
  handlers: AppHandlers;
}

const TOPICS = [
  "#design", "#webdev", "#ux", "#react", "#typescript",
  "#photography", "#minimalism", "#openSource", "#travel", "#architecture",
];

export default function ExplorePage({ currentUser, users, handlers }: Props) {
  const [query, setQuery] = useState("");

  const otherUsers = users.filter((u) => u.id !== currentUser.id);

  const filtered = query.trim()
    ? otherUsers.filter(
        (u) =>
          u.fullName.toLowerCase().includes(query.toLowerCase()) ||
          u.username.toLowerCase().includes(query.toLowerCase()) ||
          u.bio.toLowerCase().includes(query.toLowerCase())
      )
    : otherUsers;

  const suggestions = otherUsers
    .filter((u) => !currentUser.following.includes(u.id))
    .slice(0, 4);

  return (
    <div className="max-w-[680px] mx-auto w-full">
      {/* Search */}
      <div className="relative mb-8">
        <Search
          size={17}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-ghost pointer-events-none"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search people, topics…"
          className="w-full bg-surface border border-white/[0.07] rounded-2xl pl-11 pr-4 py-3.5 text-ink placeholder-ghost text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
        />
      </div>

      {!query && (
        <>
          {/* Topics */}
          <div className="mb-8">
            <h2
              className="text-ink font-semibold text-sm mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Trending Topics
            </h2>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((t) => (
                <button
                  key={t}
                  className="px-3 py-1.5 bg-surface hover:bg-lift border border-white/[0.07] hover:border-accent/40 rounded-full text-dim hover:text-accent text-sm transition-all duration-150"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="mb-8">
              <h2
                className="text-ink font-semibold text-sm mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                People to Follow
              </h2>
              <div className="grid gap-3">
                {suggestions.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    currentUser={currentUser}
                    handlers={handlers}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* All / search results */}
      <div>
        {query && (
          <h2
            className="text-ink font-semibold text-sm mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {filtered.length === 0
              ? "No results"
              : `${filtered.length} result${filtered.length > 1 ? "s" : ""}`}
          </h2>
        )}
        {!query && (
          <h2
            className="text-ink font-semibold text-sm mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            All Members
          </h2>
        )}
        <div className="grid gap-3">
          {filtered.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              currentUser={currentUser}
              handlers={handlers}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function UserCard({
  user,
  currentUser,
  handlers,
}: {
  key?: string;
  user: User;
  currentUser: User;
  handlers: AppHandlers;
}) {
  const isFollowing = currentUser.following.includes(user.id);

  return (
    <div className="flex items-center gap-4 bg-surface hover:bg-lift border border-white/[0.07] rounded-2xl p-4 transition-all duration-150">
      <button onClick={() => handlers.onNavigate("profile", user.id)}>
        <img
          src={user.avatar}
          alt={user.fullName}
          className="w-12 h-12 rounded-xl object-cover bg-rim flex-shrink-0"
        />
      </button>
      <div className="flex-1 min-w-0">
        <button
          onClick={() => handlers.onNavigate("profile", user.id)}
          className="block text-left"
        >
          <p className="text-ink text-sm font-semibold hover:text-accent transition-colors truncate">
            {user.fullName}
          </p>
          <p className="text-ghost text-xs truncate">@{user.username}</p>
        </button>
        {user.bio && (
          <p className="text-dim text-xs mt-1 line-clamp-1">{user.bio}</p>
        )}
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="text-center hidden sm:block">
          <p className="text-ink text-sm font-semibold">{user.followers.length}</p>
          <p className="text-ghost text-xs">Followers</p>
        </div>
        <button
          onClick={() => handlers.onFollowUser(user.id)}
          className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-xl transition-all duration-150 ${
            isFollowing
              ? "border border-white/10 text-dim hover:border-heart/40 hover:text-heart"
              : "bg-accent hover:bg-accent-hover text-white"
          }`}
        >
          {isFollowing ? (
            <><UserCheck size={14} /> Following</>
          ) : (
            <><UserPlus size={14} /> Follow</>
          )}
        </button>
      </div>
    </div>
  );
}
