import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "../../store/userStore";

interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  platform?: string;
}

export default function ChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);
  const { user } = useUserStore();

  const { conversationId, platform, sender } = params as {
    conversationId: string;
    platform?: string;
    sender?: string;
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    // Sample messages based on conversation
    {
      id: "1",
      sender: sender || "Sarah Johnson",
      content: "Hey team, don't forget about the meeting at 3 PM today!",
      timestamp: "10:30 AM",
      isOwn: false,
      platform: platform,
    },
    {
      id: "2",
      sender: "You",
      content: "Thanks for the reminder! I'll be there.",
      timestamp: "10:32 AM",
      isOwn: true,
      platform: platform,
    },
    {
      id: "3",
      sender: sender || "Sarah Johnson",
      content: "Great! Also, please review the latest designs when you can.",
      timestamp: "10:33 AM",
      isOwn: false,
      platform: platform,
    },
    {
      id: "4",
      sender: "You",
      content: "Will do. Thanks Sarah!",
      timestamp: "10:35 AM",
      isOwn: true,
      platform: platform,
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: user?.fullName || "You",
      content: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isOwn: true,
      platform: platform,
    };

    setMessages([...messages, newMessage]);
    setInputMessage("");

    // TODO: Send to FastAPI backend later (which will forward to Slack/Gmail)
  };

  const handleSummarizeConversation = async () => {
    setIsSummarizing(true);
    // TODO: Call FastAPI /summarize endpoint later
    setTimeout(() => {
      setSummary(
        "This conversation is about the Q1 meeting reminder and design review. Sarah reminded the team about the 3 PM meeting and requested a review of the latest designs. The user confirmed attendance and agreed to review the designs.",
      );
      setIsSummarizing(false);
    }, 1500);
  };

  const handlePullMessages = async () => {
    setIsLoading(true);
    // TODO: Call FastAPI sync endpoint
    setTimeout(() => {
      Alert.alert("Success", "Latest messages pulled from platform");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <View style={styles.headerTitleContainer}>
              <View
                style={[styles.platformIcon, { backgroundColor: "#007AFF15" }]}
              >
                <Ionicons name="chatbubble-outline" size={20} color="#007AFF" />
              </View>
              <Text style={styles.headerTitle}>{sender || "Conversation"}</Text>
            </View>
            {platform && (
              <Text style={styles.headerSubtitle}>
                {platform.toUpperCase()}
              </Text>
            )}
          </View>

          <TouchableOpacity onPress={handlePullMessages}>
            <Ionicons name="sync-outline" size={22} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* AI Summary */}
        {summary && (
          <View style={styles.summaryContainer}>
            <View style={styles.summaryHeader}>
              <Ionicons name="sparkles-outline" size={20} color="#FF9500" />
              <Text style={styles.summaryTitle}>AI Summary</Text>
              <TouchableOpacity onPress={() => setSummary(null)}>
                <Ionicons name="close" size={20} color="#8E8E93" />
              </TouchableOpacity>
            </View>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        )}

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageWrapper,
                msg.isOwn
                  ? styles.messageWrapperOwn
                  : styles.messageWrapperOther,
              ]}
            >
              {!msg.isOwn && (
                <Text style={styles.senderName}>{msg.sender}</Text>
              )}
              <View
                style={[
                  styles.messageBubble,
                  msg.isOwn
                    ? styles.messageBubbleOwn
                    : styles.messageBubbleOther,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    msg.isOwn ? styles.messageTextOwn : styles.messageTextOther,
                  ]}
                >
                  {msg.content}
                </Text>
                <Text style={styles.messageTime}>{msg.timestamp}</Text>
              </View>
            </View>
          ))}
          {isLoading && (
            <ActivityIndicator style={{ margin: 16 }} color="#007AFF" />
          )}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.summarizeButton}
            onPress={handleSummarizeConversation}
            disabled={isSummarizing}
          >
            {isSummarizing ? (
              <ActivityIndicator color="#007AFF" />
            ) : (
              <Ionicons name="sparkles-outline" size={24} color="#007AFF" />
            )}
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={inputMessage}
            onChangeText={setInputMessage}
            multiline
          />

          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}
            disabled={!inputMessage.trim()}
          >
            <Ionicons
              name="send"
              size={22}
              color={inputMessage.trim() ? "#007AFF" : "#C6C6C8"}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  keyboardView: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: { padding: 8, marginRight: 8 },
  headerInfo: { flex: 1 },
  headerTitleContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  platformIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#333" },
  headerSubtitle: { fontSize: 12, marginLeft: 40, color: "#007AFF" },
  summaryContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: "#FFF9E6",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFE5B4",
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  summaryTitle: { flex: 1, fontSize: 14, fontWeight: "600", color: "#FF9500" },
  summaryText: { fontSize: 14, color: "#666", lineHeight: 20 },
  messagesContainer: { flex: 1 },
  messagesContent: { padding: 16 },
  messageWrapper: { marginBottom: 16 },
  messageWrapperOwn: { alignItems: "flex-end" },
  messageWrapperOther: { alignItems: "flex-start" },
  senderName: {
    fontSize: 12,
    color: "#8E8E93",
    marginLeft: 12,
    marginBottom: 4,
  },
  messageBubble: { maxWidth: "80%", padding: 12, borderRadius: 20 },
  messageBubbleOwn: { backgroundColor: "#007AFF", borderBottomRightRadius: 4 },
  messageBubbleOther: { backgroundColor: "#F2F2F7", borderBottomLeftRadius: 4 },
  messageText: { fontSize: 15, lineHeight: 20 },
  messageTextOwn: { color: "#fff" },
  messageTextOther: { color: "#333" },
  messageTime: {
    fontSize: 10,
    color: "#8E8E93",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 12,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  summarizeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
