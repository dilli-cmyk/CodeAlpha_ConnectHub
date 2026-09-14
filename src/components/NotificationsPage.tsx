import { Heart, MessageCircle, UserPlus, Bell } from "lucide-react";
import type { Notification, User, AppHandlers } from "../types";
import { formatTime } from "../utils/helpers";

interface Props {
  notifications: Notification[];
  users: User[];
  currentUser: User;
  handlers: AppHandlers;
  onMarkAllRead: () => void;
}

export default function NotificationsPage({
  notifications,
  users,
  currentUser,
  handlers,
  onMarkAllRead,
}: Props) {
  const getUser = (id: string) => users.find((u) => u.id === id);

  const unread = notifications.filter((n) => !n.read).length;

  const grouped: Record<string, Notification[]> = {};
  notifications.forEach((n) => {
    const date = new Date(n.createdAt);
    const now = new Date();
    const diffDay = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );
    const key = diffDay === 0 ? "Today" : diffDay <= 7 ? "This week" : "Earlier";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(n);
  });

  const typeConfig = {
    like: { icon: Heart, color: "text-heart", bg: "bg-heart/15", label: "liked your post" },
    comment: { icon: MessageCircle, color: "text-accent", bg: "bg-accent/15", label: "commented on your post" },
    follow: { icon: UserPlus, color: "text-teal", bg: "bg-teal/15", label: "started following you" },
  };

  return (
    <div className="max-w-[600px] mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-xl font-bold text-ink"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Notifications
          </h1>
          {unread > 0 && (
            <p className="text-dim text-xs mt-0.5">{unread} unread</p>
          )}
        </div>
        {unread > 0 && (
          <button
            onClick={onMarkAllRead}
            className="text-accent text-sm hover:underline"
          >
            Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-14 h-14 bg-surface border border-white/[0.07] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bell size={24} className="text-ghost" />
          </div>
          <p className="text-dim font-medium">No notifications yet</p>
          <p className="text-ghost text-sm mt-1">When people interact with you, it'll show here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group}>
              <p className="text-ghost text-xs font-medium uppercase tracking-wider mb-3">
                {group}
              </p>
              <div className="space-y-1">
                {items.map((n) => {
                  const from = getUser(n.fromUserId);
                  if (!from) return null;
                  const cfg = typeConfig[n.type];
                  const Icon = cfg.icon;
                  return (
                    <button
                      key={n.id}
                      onClick={() => {
                        if (n.type === "follow") {
                          handlers.onNavigate("profile", n.fromUserId);
                        } else {
                          handlers.onNavigate("profile", n.fromUserId);
                        }
                      }}
                      className={`w-full flex items-start gap-3 p-4 rounded-2xl transition-all duration-150 text-left ${
                        !n.read
                          ? "bg-surface hover:bg-lift border border-white/[0.07]"
                          : "hover:bg-surface/50"
                      }`}
                    >
                      <div className="relative flex-shrink-0">
                        <img
                          src={from.avatar}
                          alt={from.fullName}
                          className="w-10 h-10 rounded-full object-cover bg-rim"
                        />
                        <div
                          className={`absolute -bottom-1 -right-1 w-5 h-5 ${cfg.bg} rounded-full flex items-center justify-center border-2 border-base`}
                        >
                          <Icon size={10} className={cfg.color} fill={n.type === "like" ? "currentColor" : "none"} />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-ink text-sm leading-snug">
                          <span className="font-semibold">{from.fullName}</span>{" "}
                          <span className="text-dim">{cfg.label}</span>
                        </p>
                        {n.message && (
                          <p className="text-ghost text-xs mt-1 line-clamp-2 italic">
                            "{n.message}"
                          </p>
                        )}
                        <p className="text-ghost text-xs mt-1">{formatTime(n.createdAt)}</p>
                      </div>

                      {!n.read && (
                        <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0 mt-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
