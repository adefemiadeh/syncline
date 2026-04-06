import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Types
interface Message {
  id: string;
  platform: "slack" | "discord" | "whatsapp";
  sender: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  channel?: string;
  isRead: boolean;
  conversationId: string;
}

interface Platform {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  isConnected: boolean;
  unreadCount: number;
}

// Fix: Import image correctly
const logoImage = require("../../../assets/images/Syncline.png");

const UnifiedInbox: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  // Connected platforms
  const platforms: Platform[] = [
    {
      id: "slack",
      name: "Slack",
      icon: "logo-slack",
      color: "#E01E5A",
      isConnected: true,
      unreadCount: 5,
    },
    {
      id: "discord",
      name: "Discord",
      icon: "logo-discord",
      color: "#5865F2",
      isConnected: true,
      unreadCount: 12,
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      icon: "logo-whatsapp",
      color: "#25D366",
      isConnected: true,
      unreadCount: 3,
    },
    {
      id: "telegram",
      name: "Telegram",
      icon: "paper-plane-outline",
      color: "#26A5E4",
      isConnected: false,
      unreadCount: 0,
    },
  ];

  // Mock messages from different platforms
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      platform: "slack",
      sender: "Sarah Johnson",
      content: "Hey team, don't forget about the meeting at 3 PM today!",
      timestamp: "10:30 AM",
      channel: "#general",
      isRead: false,
      conversationId: "slack-conv-1",
    },
    {
      id: "2",
      platform: "discord",
      sender: "Alex Chen",
      content:
        "I've pushed the latest changes to the dev branch. Can someone review?",
      timestamp: "9:45 AM",
      channel: "dev-chat",
      isRead: false,
      conversationId: "discord-conv-1",
    },
    {
      id: "3",
      platform: "whatsapp",
      sender: "Mom",
      content: "Are you coming for dinner this weekend?",
      timestamp: "8:15 AM",
      isRead: true,
      conversationId: "whatsapp-conv-1",
    },
    {
      id: "4",
      platform: "slack",
      sender: "Mike Ross",
      content: "The client approved the design. Great work everyone! 🎉",
      timestamp: "Yesterday",
      channel: "#design",
      isRead: true,
      conversationId: "slack-conv-2",
    },
    {
      id: "5",
      platform: "discord",
      sender: "Emma Watson",
      content: "Has anyone tested the new authentication flow?",
      timestamp: "Yesterday",
      channel: "dev-chat",
      isRead: true,
      conversationId: "discord-conv-2",
    },
    {
      id: "6",
      platform: "whatsapp",
      sender: "John Smith",
      content: "Can you send me the project files?",
      timestamp: "Yesterday",
      isRead: false,
      conversationId: "whatsapp-conv-2",
    },
  ]);

  const getPlatformIcon = (
    platform: string,
  ): keyof typeof Ionicons.glyphMap => {
    switch (platform) {
      case "slack":
        return "logo-slack";
      case "discord":
        return "logo-discord";
      case "whatsapp":
        return "logo-whatsapp";
      default:
        return "chatbubble-outline";
    }
  };

  const getPlatformColor = (platform: string): string => {
    switch (platform) {
      case "slack":
        return "#E01E5A";
      case "discord":
        return "#5865F2";
      case "whatsapp":
        return "#25D366";
      default:
        return "#8E8E93";
    }
  };

  const filteredMessages = messages.filter((message) => {
    const matchesPlatform = selectedPlatform
      ? message.platform === selectedPlatform
      : true;
    const matchesSearch =
      searchQuery.toLowerCase() === "" ||
      message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.sender.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  const getUnreadCount = () => {
    return messages.filter((m) => !m.isRead).length;
  };

  const handleMessagePress = (message: Message) => {
    // Mark as read
    setMessages((prevMessages) =>
      prevMessages.map((m) =>
        m.id === message.id ? { ...m, isRead: true } : m,
      ),
    );

    // Navigate to chat thread
    router.push({
      pathname: "/chat",
      params: {
        conversationId: message.conversationId,
        platform: message.platform,
        sender: message.sender,
      },
    });
  };

  const handleConnectPlatform = (platformId: string) => {
    // In a real app, this would open OAuth flow
    console.log(`Connect to ${platformId}`);
  };

  const handleNavigateToSettings = () => {
    router.push("/(tabs)/settings");
  };

  const renderPlatform = ({ item }: { item: Platform }) => (
    <TouchableOpacity
      style={[
        styles.platformCard,
        selectedPlatform === item.id && styles.platformCardActive,
        !item.isConnected && styles.platformCardDisabled,
      ]}
      onPress={() =>
        item.isConnected
          ? setSelectedPlatform(selectedPlatform === item.id ? null : item.id)
          : handleConnectPlatform(item.id)
      }
    >
      <View
        style={[styles.platformIcon, { backgroundColor: `${item.color}15` }]}
      >
        <Ionicons name={item.icon} size={24} color={item.color} />
      </View>
      <Text style={styles.platformName}>{item.name}</Text>
      {item.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
        </View>
      )}
      {!item.isConnected && (
        <View style={styles.connectBadge}>
          <Text style={styles.connectBadgeText}>Connect</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderMessage = ({ item }: { item: Message }) => (
    <TouchableOpacity
      style={[styles.messageCard, !item.isRead && styles.messageCardUnread]}
      onPress={() => handleMessagePress(item)}
    >
      <View
        style={[
          styles.messagePlatformIcon,
          { backgroundColor: `${getPlatformColor(item.platform)}15` },
        ]}
      >
        <Ionicons
          name={getPlatformIcon(item.platform)}
          size={20}
          color={getPlatformColor(item.platform)}
        />
      </View>
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <View style={styles.senderInfo}>
            <Text
              style={[
                styles.senderName,
                !item.isRead && styles.senderNameUnread,
              ]}
            >
              {item.sender}
            </Text>
            {item.channel && (
              <Text style={styles.channelName}>#{item.channel}</Text>
            )}
          </View>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <Text
          style={[styles.messageText, !item.isRead && styles.messageTextUnread]}
          numberOfLines={2}
        >
          {item.content}
        </Text>
        <View style={styles.platformTag}>
          <Text
            style={[
              styles.platformTagText,
              { color: getPlatformColor(item.platform) },
            ]}
          >
            {item.platform.toUpperCase()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header - Logo directly in front of Syncline text */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View>
              <Text style={styles.greeting}>Welcome to</Text>
              <View style={styles.titleRow}>
                <Text style={styles.appName}>Syncline</Text>
                <Image
                  source={logoImage}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
          {/* <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleNavigateToSettings}
            >
              <Ionicons name="settings-outline" size={24} color="#333" />
            </TouchableOpacity>
          </View> */}
        </View>

        {/* Stats Bar */}
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{getUnreadCount()}</Text>
            <Text style={styles.statLabel}>Unread</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{messages.length}</Text>
            <Text style={styles.statLabel}>Total Messages</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {platforms.filter((p) => p.isConnected).length}
            </Text>
            <Text style={styles.statLabel}>Connected</Text>
          </View>
        </View>

        {/* Platforms Scroll */}
        <View style={styles.platformsSection}>
          <Text style={styles.sectionTitle}>Connected Platforms</Text>
          <FlatList
            data={platforms}
            renderItem={renderPlatform}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.platformsList}
          />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color="#8E8E93"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search messages or senders..."
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>

        {/* Messages List */}
        <View style={styles.messagesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedPlatform
                ? `${
                    platforms.find((p) => p.id === selectedPlatform)?.name
                  } Messages`
                : "Unified Inbox"}
            </Text>
            {selectedPlatform && (
              <TouchableOpacity onPress={() => setSelectedPlatform(null)}>
                <Text style={styles.clearFilterText}>Clear Filter</Text>
              </TouchableOpacity>
            )}
          </View>

          {filteredMessages.length > 0 ? (
            <FlatList
              data={filteredMessages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.messagesList}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="chatbubbles-outline" size={64} color="#C6C6C8" />
              <Text style={styles.emptyStateTitle}>No messages found</Text>
              <Text style={styles.emptyStateText}>
                {searchQuery
                  ? `No messages matching "${searchQuery}"`
                  : selectedPlatform
                    ? `No messages from ${selectedPlatform} yet`
                    : "Connect more platforms to see messages here"}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    marginTop: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 2,
  },
  logoImage: {
    width: 30,
    height: 30,
    borderRadius: 16,
  },
  greeting: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 4,
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007AFF",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    padding: 8,
  },
  statsBar: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#8E8E93",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E5E5EA",
  },
  platformsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginHorizontal: 20,
    marginBottom: 12,
  },
  platformsList: {
    paddingHorizontal: 16,
  },
  platformCard: {
    alignItems: "center",
    marginHorizontal: 4,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    minWidth: 80,
    position: "relative",
  },
  platformCardActive: {
    borderColor: "#007AFF",
    backgroundColor: "#F0F9FF",
  },
  platformCardDisabled: {
    opacity: 0.5,
  },
  platformIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  platformName: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
  },
  unreadBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  unreadBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  connectBadge: {
    marginTop: 4,
    backgroundColor: "#007AFF",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  connectBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    marginHorizontal: 20,
    marginBottom: 24,
    paddingHorizontal: 12,
    borderRadius: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  messagesSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  clearFilterText: {
    fontSize: 14,
    color: "#007AFF",
  },
  messagesList: {
    paddingHorizontal: 16,
  },
  messageCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  messageCardUnread: {
    backgroundColor: "#F0F9FF",
    borderColor: "#007AFF",
  },
  messagePlatformIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  senderInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  senderName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  senderNameUnread: {
    fontWeight: "700",
    color: "#007AFF",
  },
  channelName: {
    fontSize: 12,
    color: "#8E8E93",
  },
  timestamp: {
    fontSize: 12,
    color: "#8E8E93",
  },
  messageText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    lineHeight: 20,
  },
  messageTextUnread: {
    color: "#333",
    fontWeight: "500",
  },
  platformTag: {
    alignSelf: "flex-start",
  },
  platformTagText: {
    fontSize: 10,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
  },
});

export default UnifiedInbox;
