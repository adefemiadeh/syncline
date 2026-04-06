import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MessageCard } from "../../components/inbox/MessageCard";
import { PlatformCard } from "../../components/inbox/PlatformCard";
import { useBackHandler } from "../../hooks/useBackHandler";
import { useUserStore } from "../../store/userStore";
import { InboxMessage, Platform } from "../../types";

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
    id: "gmail",
    name: "Gmail",
    icon: "mail-outline",
    color: "#EA4335",
    isConnected: false,
    unreadCount: 0,
  },
];

const initialMessages: InboxMessage[] = [
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
];

export default function HomeScreen() {
  useBackHandler(true);
  const router = useRouter();
  const { user } = useUserStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [messages] = useState(initialMessages);

  const filteredMessages = messages.filter((msg) => {
    const platformMatch =
      !selectedPlatform || msg.platform === selectedPlatform;
    const searchMatch =
      !searchQuery ||
      msg.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.content.toLowerCase().includes(searchQuery.toLowerCase());
    return platformMatch && searchMatch;
  });

  const unreadCount = messages.filter((m) => !m.isRead).length;

  const handleMessagePress = (message: InboxMessage) => {
    router.push({
      pathname: "/(tabs)/chat",
      params: {
        conversationId: message.conversationId,
        platform: message.platform,
        sender: message.sender,
      },
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    // TODO: Later connect to TanStack Query refetch
    setTimeout(() => setRefreshing(false), 1200);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome to</Text>
            <View style={styles.titleRow}>
              <Text style={styles.appName}>Syncline</Text>
              <Image
                source={require("../../../assets/images/Syncline.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>

        {/* Stats Bar */}
        <View style={styles.statsBar}>
          {/* <View style={styles.statItem}>
            <Text style={styles.statNumber}>{unreadCount}</Text>
            <Text style={styles.statLabel}>Unread</Text>
          </View> */}
          {/* <View style={styles.statDivider} /> */}
          {/* <View style={styles.statItem}> */}
          {/* <Text style={styles.statNumber}>{messages.length}</Text> */}
          {/* <Text style={styles.statLabel}>Total</Text> */}
          {/* </View> */}
          {/* <View style={styles.statDivider} /> */}
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {platforms.filter((p) => p.isConnected).length}
            </Text>
            <Text style={styles.statLabel}>Connected</Text>
          </View>
        </View>

        {/* Platforms Section */}
        <View style={styles.platformsSection}>
          <Text style={styles.sectionTitle}>Connected Platforms</Text>
          <FlatList
            horizontal
            data={platforms}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.platformsList}
            renderItem={({ item }) => (
              <PlatformCard
                item={item}
                isSelected={selectedPlatform === item.id}
                onPress={() =>
                  setSelectedPlatform(
                    selectedPlatform === item.id ? null : item.id,
                  )
                }
              />
            )}
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

        {/* Messages Section */}
        <View style={styles.messagesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedPlatform
                ? `${platforms.find((p) => p.id === selectedPlatform)?.name} Messages`
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
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.messagesList}
              renderItem={({ item }) => (
                <MessageCard item={item} onPress={handleMessagePress} />
              )}
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
}

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
  greeting: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007AFF",
  },
  logoImage: {
    width: 32,
    height: 32,
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
