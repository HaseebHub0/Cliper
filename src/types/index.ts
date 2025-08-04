export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  profilePicture: string;
  bio: string;
  followers: string[];
  following: string[];
  posts: Post[];
}

export interface Post {
  id: string;
  userId: string;
  imageUrl: string;
  caption: string;
  likes: string[];
  comments: Comment[];
  createdAt: Date;
  location?: string;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  text: string;
  createdAt: Date;
}

export interface Story {
  id: string;
  userId: string;
  username: string;
  profilePicture: string;
  imageUrl: string;
  createdAt: Date;
}

export interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string, fullName: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
} 