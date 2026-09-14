export interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  likes: string[];
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  image?: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
  edited?: boolean;
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  bio: string;
  email: string;
  password: string;
  avatar: string;
  coverPhoto: string;
  followers: string[];
  following: string[];
  postIds: string[];
  createdAt: string;
}

export interface Notification {
  id: string;
  type: "like" | "comment" | "follow";
  fromUserId: string;
  postId?: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export type View = "feed" | "profile" | "explore" | "notifications";

export interface AppHandlers {
  onNavigate: (view: View, userId?: string) => void;
  onLikePost: (postId: string) => void;
  onCommentPost: (postId: string, content: string) => void;
  onEditPost: (postId: string, content: string, image?: string) => void;
  onDeletePost: (postId: string) => void;
  onCreatePost: (content: string, image?: string) => void;
  onFollowUser: (userId: string) => void;
  onUpdateProfile: (updates: Partial<Pick<User, "fullName" | "bio" | "avatar" | "coverPhoto">>) => void;
  onLogout: () => void;
  onShowToast: (message: string, type?: "success" | "error") => void;
}
