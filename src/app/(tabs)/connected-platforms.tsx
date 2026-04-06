import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

interface Platform {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  isConnected: boolean;
  username?: string;
  connectedAt?: string;
}

export default function ConnectedPlatformsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [platforms, setPlatforms] = useState<Platform[]>([
    {
      id: "slack",
      name: "Slack",
      icon: "logo-slack",
      color: "#E01E5A",
      isConnected: true,
      username: "workspace.slack.com",
      connectedAt: "2024-01-15",
    },
    {
      id: "discord",
      name: "Discord",
      icon: "logo-discord",
      color: "#5865F2",
      isConnected: true,
      username: "username#1234",
      connectedAt: "2024-01-20",
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      icon: "logo-whatsapp",
      color: "#25D366",
      isConnected: false,
    },
    {
      id: "telegram",
      name: "Telegram",
      icon: "paper-plane-outline",
      color: "#26A5E4",
      isConnected: false,
    },
    {
      id: "gmail",
      name: "Gmail",
      icon: "mail-outline",
      color: "#EA4335",
      isConnected: false,
    },
    {
      id: "outlook",
      name: "Outlook",
      icon: "briefcase-outline",
      color: "#0078D4",
      isConnected: false,
    },
  ]);

  const [connecting, setConnecting] = useState<string | null>(null);
  const [showOAuthModal, setShowOAuthModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(
    null,
  );

  const handleConnect = async (platform: Platform) => {
    setConnecting(platform.id);
    setSelectedPlatform(platform);
    setShowOAuthModal(true);

    // Simulate OAuth flow
    setTimeout(() => {
      setConnecting(null);
      // In real app, this would open OAuth URL
      Alert.alert(
        "Connect Account",
        `Would you like to connect ${platform.name}?`,
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => setShowOAuthModal(false),
          },
          {
            text: "Connect",
            onPress: () => {
              setPlatforms((prev) =>
                prev.map((p) =>
                  p.id === platform.id
                    ? {
                        ...p,
                        isConnected: true,
                        username: `user@${platform.name.toLowerCase()}.com`,
                        connectedAt: new Date().toISOString(),
                      }
                    : p,
                ),
              );
              setShowOAuthModal(false);
              Alert.alert(
                "Success",
                `${platform.name} connected successfully!`,
              );
            },
          },
        ],
      );
    }, 1000);
  };

  const handleDisconnect = (platform: Platform) => {
    Alert.alert(
      "Disconnect Account",
      `Are you sure you want to disconnect ${platform.name}? You won't receive messages from this platform until you reconnect.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Disconnect",
          style: "destructive",
          onPress: () => {
            setPlatforms((prev) =>
              prev.map((p) =>
                p.id === platform.id
                  ? {
                      ...p,
                      isConnected: false,
                      username: undefined,
                      connectedAt: undefined,
                    }
                  : p,
              ),
            );
            Alert.alert(
              "Disconnected",
              `${platform.name} has been disconnected.`,
            );
          },
        },
      ],
    );
  };

  const handleRefresh = () => {
    // In real app, this would refresh connection status from backend
    Alert.alert("Refreshing", "Checking connection status...");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Connected Platforms</Text>
          <TouchableOpacity
            onPress={handleRefresh}
            style={styles.refreshButton}
          >
            <Ionicons name="refresh-outline" size={22} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            Connect your communication platforms to see all your messages in one
            unified inbox. Syncline will aggregate messages from all connected
            platforms.
          </Text>
        </View>

        {/* Platforms List */}
        <View style={styles.platformsContainer}>
          {platforms.map((platform) => (
            <View key={platform.id} style={styles.platformCard}>
              <View style={styles.platformInfo}>
                <View
                  style={[
                    styles.platformIcon,
                    { backgroundColor: `${platform.color}15` },
                  ]}
                >
                  <Ionicons
                    name={platform.icon}
                    size={28}
                    color={platform.color}
                  />
                </View>
                <View style={styles.platformDetails}>
                  <Text style={styles.platformName}>{platform.name}</Text>
                  {platform.isConnected && platform.username && (
                    <Text style={styles.platformUsername}>
                      {platform.username}
                    </Text>
                  )}
                  {platform.isConnected && platform.connectedAt && (
                    <Text style={styles.connectedDate}>
                      Connected{" "}
                      {new Date(platform.connectedAt).toLocaleDateString()}
                    </Text>
                  )}
                </View>
              </View>

              {platform.isConnected ? (
                <TouchableOpacity
                  style={styles.disconnectButton}
                  onPress={() => handleDisconnect(platform)}
                >
                  <Text style={styles.disconnectText}>Disconnect</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.connectButton}
                  onPress={() => handleConnect(platform)}
                  disabled={connecting === platform.id}
                >
                  {connecting === platform.id ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.connectText}>Connect</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Ionicons
              name="shield-checkmark-outline"
              size={24}
              color="#34C759"
            />
            <Text style={styles.infoTitle}>Your data is secure</Text>
            <Text style={styles.infoText}>
              Syncline uses OAuth 2.0 to securely connect to your accounts. We
              never store your passwords.
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Ionicons name="sync-outline" size={24} color="#007AFF" />
            <Text style={styles.infoTitle}>Real-time sync</Text>
            <Text style={styles.infoText}>
              Messages sync in real-time. You'll never miss an important message
              from any platform.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* OAuth Modal (simulated) */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={showOAuthModal}
        onRequestClose={() => setShowOAuthModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowOAuthModal(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              Connect {selectedPlatform?.name}
            </Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.modalContent}>
            <Ionicons
              name={selectedPlatform?.icon || "apps"}
              size={64}
              color={selectedPlatform?.color}
            />
            <Text style={styles.modalText}>
              You'll be redirected to {selectedPlatform?.name} to authorize
              Syncline.
            </Text>
            <ActivityIndicator style={{ marginTop: 20 }} color="#007AFF" />
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  refreshButton: {
    padding: 8,
    marginRight: -8,
  },
  descriptionContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  platformsContainer: {
    paddingHorizontal: 16,
  },
  platformCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  platformInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  platformIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  platformDetails: {
    flex: 1,
  },
  platformName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  platformUsername: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  connectedDate: {
    fontSize: 12,
    color: "#8E8E93",
  },
  connectButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  connectText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  disconnectButton: {
    backgroundColor: "#FFF2F0",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  disconnectText: {
    color: "#FF3B30",
    fontSize: 14,
    fontWeight: "600",
  },
  infoSection: {
    padding: 20,
    marginTop: 16,
    marginBottom: 32,
  },
  infoCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 8,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    lineHeight: 18,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
    lineHeight: 24,
  },
});
