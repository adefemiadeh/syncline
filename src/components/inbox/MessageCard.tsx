// src/components/inbox/MessageCard.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { InboxMessage } from "../../types";

interface MessageCardProps {
  item: InboxMessage;
  onPress: (message: InboxMessage) => void;
}

export const MessageCard: React.FC<MessageCardProps> = ({ item, onPress }) => {
  const getPlatformColor = (platform: string): string => {
    switch (platform) {
      case "slack":
        return "#E01E5A";
      case "discord":
        return "#5865F2";
      case "whatsapp":
        return "#25D366";
      case "gmail":
        return "#EA4335";
      default:
        return "#8E8E93";
    }
  };

  return (
    <TouchableOpacity
      style={[styles.messageCard, !item.isRead && styles.messageCardUnread]}
      onPress={() => onPress(item)}
    >
      <View
        style={[
          styles.messagePlatformIcon,
          { backgroundColor: `${getPlatformColor(item.platform)}15` },
        ]}
      >
        <Ionicons
          name="chatbubble-outline"
          size={20}
          color={getPlatformColor(item.platform)}
        />
      </View>

      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text
            style={[styles.senderName, !item.isRead && styles.senderNameUnread]}
          >
            {item.sender}
          </Text>
          {item.channel && (
            <Text style={styles.channelName}>#{item.channel}</Text>
          )}
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
};

const styles = StyleSheet.create({
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
    marginBottom: 6,
  },
  senderName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    flex: 1,
  },
  senderNameUnread: {
    fontWeight: "700",
    color: "#007AFF",
  },
  channelName: {
    fontSize: 12,
    color: "#8E8E93",
    marginRight: 8,
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
});
