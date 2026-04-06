// src/components/inbox/PlatformCard.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Platform } from "../../types";

interface PlatformCardProps {
  item: Platform;
  isSelected: boolean;
  onPress: () => void;
}

export const PlatformCard: React.FC<PlatformCardProps> = ({
  item,
  isSelected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.platformCard,
        isSelected && styles.platformCardActive,
        !item.isConnected && styles.platformCardDisabled,
      ]}
      onPress={onPress}
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
};

const styles = StyleSheet.create({
  platformCard: {
    alignItems: "center",
    marginHorizontal: 6,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    minWidth: 85,
    position: "relative",
  },
  platformCardActive: {
    borderColor: "#007AFF",
    backgroundColor: "#F0F9FF",
  },
  platformCardDisabled: {
    opacity: 0.55,
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
});
