import { useState, useRef, type ChangeEvent } from "react";
import {
  UserPlus,
  UserCheck,
  Pencil,
  Camera,
  Grid3X3,
  List,
  X,
  Check,
  CalendarDays,
} from "lucide-react";
import type { Post, User, AppHandlers } from "../types";
import PostCard from "./PostCard";
import { formatFullDate } from "../utils/helpers";

interface Props {
  profileUser: User;
  currentUser: User;
  posts: Post[];
  users: User[];
  handlers: AppHandlers;
}

export default function ProfilePage({
  profileUser,
  currentUser,
  posts,
  users,
  handlers,
}: Props) {
  const isOwnProfile = profileUser.id === currentUser.id;
  const isFollowing = currentUser.following.includes(profileUser.id);
  const [gridView, setGridView] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const userPosts = posts
    .filter((p) => p.userId === profileUser.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getUser = (id: string) => users.find((u) => u.id === id);

  return (
    <div className="max-w-[680px] mx-auto w-full">
      {/* Cover photo */}
      <div className="relative h-44 md:h-56 rounded-2xl overflow-hidden bg-rim mb-0">
        <img
          src={profileUser.coverPhoto}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-base/60 to-transparent" />
      </div>

      {/* Avatar + actions row */}
      <div className="flex items-end justify-between px-4 -mt-12 mb-4">
        <div className="relative">
          <img
            src={profileUser.avatar}
            alt={profileUser.fullName}
            className="w-24 h-24 rounded-2xl object-cover border-4 border-base bg-rim"
          />
        </div>

        <div className="flex items-center gap-2 mt-14">
          {isOwnProfile ? (
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-2 border border-white/10 hover:border-accent/40 hover:text-accent text-dim text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200"
            >
              <Pencil size={14} /> Edit Profile
            </button>
          ) : (
            <button
              onClick={() => handlers.onFollowUser(profileUser.id)}
              className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 ${
                isFollowing
                  ? "border border-white/10 text-dim hover:border-heart/40 hover:text-heart"
                  : "bg-accent hover:bg-accent-hover text-white"
              }`}
            >
              {isFollowing ? (
                <><UserCheck size={15} /> Following</>
              ) : (
                <><UserPlus size={15} /> Follow</>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Profile info */}
      <div className="px-4 mb-6">
        <h1
          className="text-xl font-bold text-ink"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {profileUser.fullName}
        </h1>
        <p className="text-dim text-sm">@{profileUser.username}</p>

        {profileUser.bio && (
          <p className="text-ink/90 text-sm leading-relaxed mt-3 max-w-md">
            {profileUser.bio}
          </p>
        )}

        <div className="flex items-center gap-1.5 mt-3 text-ghost text-xs">
          <CalendarDays size={12} />
          <span>Joined {formatFullDate(profileUser.createdAt)}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/[0.07]">
          <div className="text-center">
            <p className="text-ink font-bold text-lg">{userPosts.length}</p>
            <p className="text-ghost text-xs mt-0.5">Posts</p>
          </div>
          <button
            onClick={() => handlers.onNavigate("explore")}
            className="text-center hover:opacity-80 transition-opacity"
          >
            <p className="text-ink font-bold text-lg">{profileUser.followers.length}</p>
            <p className="text-ghost text-xs mt-0.5">Followers</p>
          </button>
          <button
            onClick={() => handlers.onNavigate("explore")}
            className="text-center hover:opacity-80 transition-opacity"
          >
            <p className="text-ink font-bold text-lg">{profileUser.following.length}</p>
            <p className="text-ghost text-xs mt-0.5">Following</p>
          </button>
        </div>
      </div>

      {/* Posts header */}
      <div className="flex items-center justify-between px-4 mb-4">
        <h2 className="text-ink font-semibold text-sm" style={{ fontFamily: "var(--font-display)" }}>
          Posts
        </h2>
        <div className="flex items-center gap-1 bg-surface border border-white/[0.07] rounded-lg p-1">
          <button
            onClick={() => setGridView(false)}
            className={`p-1.5 rounded transition-colors ${!gridView ? "bg-lift text-ink" : "text-ghost hover:text-dim"}`}
          >
            <List size={14} />
          </button>
          <button
            onClick={() => setGridView(true)}
            className={`p-1.5 rounded transition-colors ${gridView ? "bg-lift text-ink" : "text-ghost hover:text-dim"}`}
          >
            <Grid3X3 size={14} />
          </button>
        </div>
      </div>

      {/* Posts grid/list */}
      {userPosts.length === 0 ? (
        <div className="text-center py-16 text-ghost">
          <p className="text-2xl mb-2">✦</p>
          <p className="text-sm">No posts yet.</p>
        </div>
      ) : gridView ? (
        <div className="grid grid-cols-3 gap-1 px-4">
          {userPosts.map((post) => (
            <div key={post.id} className="aspect-square bg-rim rounded-lg overflow-hidden">
              {post.image ? (
                <img src={post.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-2 bg-lift">
                  <p className="text-dim text-xs text-center line-clamp-4 leading-relaxed">
                    {post.content}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4 px-0">
          {userPosts.map((post) => {
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
          })}
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          user={profileUser}
          onSave={(updates) => {
            handlers.onUpdateProfile(updates);
            setShowEditModal(false);
          }}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
}

function EditProfileModal({
  user,
  onSave,
  onClose,
}: {
  user: User;
  onSave: (u: Partial<Pick<User, "fullName" | "bio" | "avatar" | "coverPhoto">>) => void;
  onClose: () => void;
}) {
  const [fullName, setFullName] = useState(user.fullName);
  const [bio, setBio] = useState(user.bio);
  const [avatar, setAvatar] = useState(user.avatar);
  const [cover, setCover] = useState(user.coverPhoto);
  const avatarRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  const handleFile = (
    e: ChangeEvent<HTMLInputElement>,
    setter: (s: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) setter(URL.createObjectURL(file));
  };

  return (
    <div className="fixed inset-0 bg-base/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
          <h3 className="font-semibold text-ink" style={{ fontFamily: "var(--font-display)" }}>
            Edit Profile
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-ghost hover:text-dim">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Cover photo */}
          <div>
            <label className="text-dim text-xs font-medium uppercase tracking-wide block mb-2">
              Cover Photo
            </label>
            <div className="relative h-28 bg-rim rounded-xl overflow-hidden group cursor-pointer" onClick={() => coverRef.current?.click()}>
              <img src={cover} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-base/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera size={22} className="text-white" />
              </div>
            </div>
            <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e, setCover)} />
          </div>

          {/* Avatar */}
          <div>
            <label className="text-dim text-xs font-medium uppercase tracking-wide block mb-2">
              Profile Photo
            </label>
            <div className="flex items-center gap-4">
              <div className="relative cursor-pointer group" onClick={() => avatarRef.current?.click()}>
                <img src={avatar} alt="" className="w-20 h-20 rounded-2xl object-cover bg-rim" />
                <div className="absolute inset-0 bg-base/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                  <Camera size={18} className="text-white" />
                </div>
              </div>
              <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e, setAvatar)} />
              <button onClick={() => avatarRef.current?.click()} className="text-accent text-sm hover:underline">
                Change photo
              </button>
            </div>
          </div>

          <div>
            <label className="text-dim text-xs font-medium uppercase tracking-wide block mb-1.5">
              Full Name
            </label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-lift border border-white/10 rounded-xl px-4 py-2.5 text-ink text-sm focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>

          <div>
            <label className="text-dim text-xs font-medium uppercase tracking-wide block mb-1.5">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={160}
              className="w-full bg-lift border border-white/10 rounded-xl px-4 py-2.5 text-ink text-sm leading-relaxed focus:outline-none focus:border-accent/50 transition-colors"
            />
            <p className="text-ghost text-xs mt-1 text-right">{bio.length}/160</p>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-white/[0.07]">
          <button onClick={onClose} className="flex-1 border border-white/10 text-dim text-sm py-2.5 rounded-xl hover:border-white/20 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => onSave({ fullName, bio, avatar, coverPhoto: cover })}
            className="flex-1 bg-accent hover:bg-accent-hover text-white text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Check size={15} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
