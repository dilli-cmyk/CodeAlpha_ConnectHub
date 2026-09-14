import { useState, useCallback } from "react";
import type { User, Post, Notification, View, AppHandlers } from "./types";
import { initialUsers, initialPosts } from "./data/mockData";
import { generateId } from "./utils/helpers";
import AuthPage from "./components/AuthPage";
import Layout from "./components/Layout";
import FeedPage from "./components/FeedPage";
import ProfilePage from "./components/ProfilePage";
import ExplorePage from "./components/ExplorePage";
import NotificationsPage from "./components/NotificationsPage";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error";
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>("feed");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // ── Toast ────────────────────────────────────────────────────────────
  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    const id = generateId();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  }, []);

  // ── Auth ─────────────────────────────────────────────────────────────
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentView("feed");
  };

  const handleRegister = (data: {
    fullName: string;
    username: string;
    email: string;
    password: string;
  }): string | null => {
    const newUser: User = {
      id: generateId(),
      username: data.username,
      fullName: data.fullName,
      bio: "",
      email: data.email,
      password: data.password,
      avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&auto=format`,
      coverPhoto: `https://images.unsplash.com/photo-1557683316-973673baf926?w=900&h=320&fit=crop&auto=format`,
      followers: [],
      following: [],
      postIds: [],
      createdAt: new Date().toISOString(),
    };
    setUsers((u) => [...u, newUser]);
    setCurrentUser(newUser);
    setCurrentView("feed");
    return null;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView("feed");
    setSelectedUserId(null);
  };

  // ── Navigation ───────────────────────────────────────────────────────
  const handleNavigate = useCallback((view: View, userId?: string) => {
    setCurrentView(view);
    if (userId) setSelectedUserId(userId);
  }, []);

  // ── Posts ────────────────────────────────────────────────────────────
  const handleCreatePost = useCallback(
    (content: string, image?: string) => {
      if (!currentUser) return;
      const newPost: Post = {
        id: generateId(),
        userId: currentUser.id,
        content,
        image,
        likes: [],
        comments: [],
        createdAt: new Date().toISOString(),
      };
      setPosts((p) => [newPost, ...p]);
      setUsers((us) =>
        us.map((u) =>
          u.id === currentUser.id
            ? { ...u, postIds: [newPost.id, ...u.postIds] }
            : u
        )
      );
      showToast("Post published!");
    },
    [currentUser, showToast]
  );

  const handleLikePost = useCallback(
    (postId: string) => {
      if (!currentUser) return;
      let targetUserId = "";
      setPosts((ps) =>
        ps.map((p) => {
          if (p.id !== postId) return p;
          targetUserId = p.userId;
          const alreadyLiked = p.likes.includes(currentUser.id);
          return {
            ...p,
            likes: alreadyLiked
              ? p.likes.filter((id) => id !== currentUser.id)
              : [...p.likes, currentUser.id],
          };
        })
      );
      // Add notification for post owner (not self)
      if (targetUserId && targetUserId !== currentUser.id) {
        const notif: Notification = {
          id: generateId(),
          type: "like",
          fromUserId: currentUser.id,
          postId,
          message: "",
          createdAt: new Date().toISOString(),
          read: false,
        };
        setNotifications((n) => [notif, ...n]);
      }
    },
    [currentUser]
  );

  const handleCommentPost = useCallback(
    (postId: string, content: string) => {
      if (!currentUser) return;
      let targetUserId = "";
      setPosts((ps) =>
        ps.map((p) => {
          if (p.id !== postId) return p;
          targetUserId = p.userId;
          const comment = {
            id: generateId(),
            userId: currentUser.id,
            content,
            createdAt: new Date().toISOString(),
            likes: [],
          };
          return { ...p, comments: [...p.comments, comment] };
        })
      );
      if (targetUserId && targetUserId !== currentUser.id) {
        const notif: Notification = {
          id: generateId(),
          type: "comment",
          fromUserId: currentUser.id,
          postId,
          message: content,
          createdAt: new Date().toISOString(),
          read: false,
        };
        setNotifications((n) => [notif, ...n]);
      }
    },
    [currentUser]
  );

  const handleEditPost = useCallback(
    (postId: string, content: string, image?: string) => {
      setPosts((ps) =>
        ps.map((p) =>
          p.id === postId ? { ...p, content, image, edited: true } : p
        )
      );
      showToast("Post updated");
    },
    [showToast]
  );

  const handleDeletePost = useCallback(
    (postId: string) => {
      setPosts((ps) => ps.filter((p) => p.id !== postId));
      if (currentUser) {
        setUsers((us) =>
          us.map((u) =>
            u.id === currentUser.id
              ? { ...u, postIds: u.postIds.filter((id) => id !== postId) }
              : u
          )
        );
      }
      showToast("Post deleted");
    },
    [currentUser, showToast]
  );

  // ── Users ────────────────────────────────────────────────────────────
  const handleFollowUser = useCallback(
    (userId: string) => {
      if (!currentUser) return;
      const isFollowing = currentUser.following.includes(userId);
      setUsers((us) =>
        us.map((u) => {
          if (u.id === currentUser.id) {
            return {
              ...u,
              following: isFollowing
                ? u.following.filter((id) => id !== userId)
                : [...u.following, userId],
            };
          }
          if (u.id === userId) {
            return {
              ...u,
              followers: isFollowing
                ? u.followers.filter((id) => id !== currentUser.id)
                : [...u.followers, currentUser.id],
            };
          }
          return u;
        })
      );
      setCurrentUser((cu) => {
        if (!cu) return cu;
        return {
          ...cu,
          following: isFollowing
            ? cu.following.filter((id) => id !== userId)
            : [...cu.following, userId],
        };
      });
      if (!isFollowing) {
        const notif: Notification = {
          id: generateId(),
          type: "follow",
          fromUserId: currentUser.id,
          message: "",
          createdAt: new Date().toISOString(),
          read: false,
        };
        setNotifications((n) => [notif, ...n]);
        showToast("Following!");
      } else {
        showToast("Unfollowed");
      }
    },
    [currentUser, showToast]
  );

  const handleUpdateProfile = useCallback(
    (updates: Partial<Pick<User, "fullName" | "bio" | "avatar" | "coverPhoto">>) => {
      if (!currentUser) return;
      setUsers((us) =>
        us.map((u) => (u.id === currentUser.id ? { ...u, ...updates } : u))
      );
      setCurrentUser((cu) => (cu ? { ...cu, ...updates } : cu));
      showToast("Profile updated!");
    },
    [currentUser, showToast]
  );

  const handleMarkAllRead = useCallback(() => {
    setNotifications((ns) => ns.map((n) => ({ ...n, read: true })));
  }, []);

  // ── Build handlers object ─────────────────────────────────────────────
  const handlers: AppHandlers = {
    onNavigate: handleNavigate,
    onLikePost: handleLikePost,
    onCommentPost: handleCommentPost,
    onEditPost: handleEditPost,
    onDeletePost: handleDeletePost,
    onCreatePost: handleCreatePost,
    onFollowUser: handleFollowUser,
    onUpdateProfile: handleUpdateProfile,
    onLogout: handleLogout,
    onShowToast: showToast,
  };

  // ── Resolved state for current view ──────────────────────────────────
  const liveCurrentUser = currentUser
    ? (users.find((u) => u.id === currentUser.id) ?? currentUser)
    : null;

  const profileUser =
    selectedUserId
      ? (users.find((u) => u.id === selectedUserId) ?? null)
      : liveCurrentUser;

  if (!liveCurrentUser) {
    return (
      <AuthPage
        onLogin={handleLogin}
        onRegister={handleRegister}
        existingUsers={users}
      />
    );
  }

  return (
    <>
      <Layout
        currentUser={liveCurrentUser}
        currentView={currentView}
        notifications={notifications}
        users={users}
        handlers={handlers}
      >
        {currentView === "feed" && (
          <FeedPage
            currentUser={liveCurrentUser}
            posts={posts}
            users={users}
            handlers={handlers}
          />
        )}

        {currentView === "profile" && profileUser && (
          <ProfilePage
            profileUser={profileUser}
            currentUser={liveCurrentUser}
            posts={posts}
            users={users}
            handlers={handlers}
          />
        )}

        {currentView === "explore" && (
          <ExplorePage
            currentUser={liveCurrentUser}
            users={users}
            handlers={handlers}
          />
        )}

        {currentView === "notifications" && (
          <NotificationsPage
            notifications={notifications}
            users={users}
            currentUser={liveCurrentUser}
            handlers={handlers}
            onMarkAllRead={handleMarkAllRead}
          />
        )}
      </Layout>

      {/* Toast stack */}
      <div className="fixed bottom-24 lg:bottom-6 right-4 z-50 flex flex-col gap-2 items-end pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`animate-toast pointer-events-auto px-4 py-2.5 rounded-xl text-sm font-medium shadow-xl border ${
              t.type === "error"
                ? "bg-heart/20 border-heart/30 text-heart"
                : "bg-surface/95 border-white/10 text-ink"
            } backdrop-blur-sm`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </>
  );
}
