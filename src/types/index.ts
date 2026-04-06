export interface User {
  id?: string;
  fullName: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  joinDate: string;
}

export interface Platform {
  id: string;
  name: string;
  icon: keyof typeof import("@expo/vector-icons").Ionicons.glyphMap;
  color: string;
  isConnected: boolean;
  unreadCount: number;
}

export interface InboxMessage {
  id: string;
  platform: string;
  sender: string;
  content: string;
  timestamp: string;
  channel?: string;
  isRead: boolean;
  conversationId: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  platform?: string;
}

export interface AppSettings {
  pushNotifications: boolean;
  darkMode: boolean;
  emailNotifications: boolean;
}
