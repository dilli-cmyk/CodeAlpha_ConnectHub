import type { ReactNode } from "react";
import {
  Home,
  Compass,
  Bell,
  User,
  LogOut,
  Sparkles,
  UserPlus,
} from "lucide-react";
import type { User as UserType, View, Notification, AppHandlers } from "../types";

interface Props {
  currentUser: UserType;
  currentView: View;
  notifications: Notification[];
  users: UserType[];
  children: ReactNode;
  handlers: AppHandlers;
}

const navItems = [
  { view: "feed" as View, icon: Home, label: "Home" },
  { view: "explore" as View, icon: Compass, label: "Explore" },
  { view: "notifications" as View, icon: Bell, label: "Notifications" },
  { view: "profile" as View, icon: User, label: "Profile" },
];

export default function Layout({
  currentUser,
  currentView,
  notifications,
  users,
  children,
  handlers,
}: Props) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  const suggestions = users
    .filter(
      (u) =>
        u.id !== currentUser.id && !currentUser.following.includes(u.id)
    )
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-base flex">
      {/* Left Sidebar */}
      <aside className="hidden lg:flex flex-col w-[240px] xl:w-[260px] flex-shrink-0 fixed left-0 top-0 h-full border-r border-white/[0.06] px-4 py-6 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-2 mb-8">
          <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
            <Sparkles size={15} className="text-white" />
          </div>
          <span
            className="text-lg font-bold text-ink"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ConnectHub
          </span>
        </div>

        {/* Nav */}
        <nav className="space-y-1 flex-1">
          {navItems.map(({ view, icon: Icon, label }) => {
            const isActive =
              currentView === view ||
              (view === "profile" &&
                currentView === "profile");
            return (
              <button
                key={view}
                onClick={() =>
                  handlers.onNavigate(
                    view === "profile" ? "profile" : view,
                    view === "profile" ? currentUser.id : undefined
                  )
                }
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 relative ${
                  isActive
                    ? "bg-accent/15 text-accent"
                    : "text-dim hover:text-ink hover:bg-white/[0.05]"
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                {label}
                {view === "notifications" && unreadCount > 0 && (
                  <span className="ml-auto bg-accent text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Current user */}
        <div className="mt-auto pt-4 border-t border-white/[0.06]">
          <button
            onClick={() => handlers.onNavigate("profile", currentUser.id)}
            className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-white/[0.05] transition-colors group"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.fullName}
              className="w-9 h-9 rounded-full object-cover bg-rim flex-shrink-0"
            />
            <div className="flex-1 min-w-0 text-left">
              <p className="text-ink text-sm font-medium truncate">
                {currentUser.fullName}
              </p>
              <p className="text-ghost text-xs truncate">
                @{currentUser.username}
              </p>
            </div>
          </button>
          <button
            onClick={handlers.onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-ghost hover:text-heart hover:bg-heart/10 text-sm transition-all duration-150 mt-1"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-[240px] xl:ml-[260px] lg:mr-[280px] xl:mr-[300px] min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-6 pb-24 lg:pb-6">
          {children}
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="hidden lg:block w-[280px] xl:w-[300px] flex-shrink-0 fixed right-0 top-0 h-full border-l border-white/[0.06] px-4 py-6 overflow-y-auto">
        {/* Who to follow */}
        {suggestions.length > 0 && (
          <div className="mb-6">
            <h3
              className="text-ink text-sm font-semibold mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Who to Follow
            </h3>
            <div className="space-y-3">
              {suggestions.map((user) => (
                <div key={user.id} className="flex items-center gap-3">
                  <button
                    onClick={() => handlers.onNavigate("profile", user.id)}
                  >
                    <img
                      src={user.avatar}
                      alt={user.fullName}
                      className="w-9 h-9 rounded-full object-cover bg-rim flex-shrink-0"
                    />
                  </button>
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => handlers.onNavigate("profile", user.id)}
                      className="block text-left"
                    >
                      <p className="text-ink text-xs font-semibold hover:text-accent transition-colors truncate">
                        {user.fullName}
                      </p>
                      <p className="text-ghost text-xs truncate">
                        @{user.username}
                      </p>
                    </button>
                  </div>
                  <button
                    onClick={() => handlers.onFollowUser(user.id)}
                    className="flex items-center gap-1 bg-accent/15 hover:bg-accent text-accent hover:text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all duration-150 flex-shrink-0"
                  >
                    <UserPlus size={12} />
                    Follow
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => handlers.onNavigate("explore")}
              className="text-accent text-xs hover:underline mt-4 block"
            >
              Show more →
            </button>
          </div>
        )}

        {/* Trending */}
        <div>
          <h3
            className="text-ink text-sm font-semibold mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Trending
          </h3>
          <div className="space-y-3">
            {[
              { tag: "#design", posts: "2.4k posts" },
              { tag: "#webdev", posts: "1.8k posts" },
              { tag: "#openSource", posts: "1.1k posts" },
              { tag: "#ux", posts: "890 posts" },
              { tag: "#minimalism", posts: "743 posts" },
            ].map(({ tag, posts }) => (
              <button
                key={tag}
                className="block w-full text-left hover:bg-surface/60 px-2 py-1.5 rounded-lg transition-colors group"
              >
                <p className="text-accent text-sm font-medium group-hover:underline">
                  {tag}
                </p>
                <p className="text-ghost text-xs">{posts}</p>
              </button>
            ))}
          </div>
        </div>

        <p className="text-ghost/50 text-xs mt-8 leading-relaxed">
          © 2026 ConnectHub · Privacy · Terms
        </p>
      </aside>

      {/* Bottom Nav (mobile) */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-surface/95 backdrop-blur-md border-t border-white/[0.07] flex z-30">
        {navItems.map(({ view, icon: Icon, label }) => {
          const isActive = currentView === view;
          return (
            <button
              key={view}
              onClick={() =>
                handlers.onNavigate(
                  view === "profile" ? "profile" : view,
                  view === "profile" ? currentUser.id : undefined
                )
              }
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors relative ${
                isActive ? "text-accent" : "text-ghost"
              }`}
            >
              <div className="relative">
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                {view === "notifications" && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
              <span>{label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
