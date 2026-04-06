import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  Alert,
  BackHandler,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSettingsStore } from "../../store/settingsStore";

// Define the types
interface ToggleItem {
  id: string;
  title: string;
  icon: string;
  color: string;
  value: boolean;
  onToggle: () => void;
  enabled: boolean;
}

interface LinkItem {
  id: string;
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
  enabled: boolean;
}

export default function SettingsScreen() {
  const router = useRouter();
  const {
    pushNotifications,
    darkMode,
    emailNotifications,
    togglePush,
    toggleDarkMode,
    toggleEmail,
  } = useSettingsStore();

  // Handle back button on modal screens - go to profile instead of closing app
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        router.replace("/(tabs)/profile");
        return true;
      },
    );

    return () => backHandler.remove();
  }, [router]);

  const toggleItems: ToggleItem[] = [
    // {
    //   id: "push",
    //   title: "Push Notifications",
    //   icon: "notifications-outline",
    //   color: "#007AFF",
    //   value: pushNotifications,
    //   onToggle: togglePush,
    //   enabled: true,
    // },
    // {
    //   id: "dark",
    //   title: "Dark Mode",
    //   icon: "moon-outline",
    //   color: "#5856D6",
    //   value: darkMode,
    //   onToggle: toggleDarkMode,
    //   enabled: false,
    // },
    // {
    //   id: "email",
    //   title: "Email Notifications",
    //   icon: "mail-outline",
    //   color: "#34C759",
    //   value: emailNotifications,
    //   onToggle: toggleEmail,
    //   enabled: true,
    // },
  ];

  const linkItems: LinkItem[] = [
    // {
    //   id: "language",
    //   title: "Language",
    //   icon: "language-outline",
    //   color: "#FF9500",
    //   onPress: () => Alert.alert("Coming soon"),
    //   enabled: false,
    // },
    // {
    //   id: "data",
    //   title: "Data Usage",
    //   icon: "cellular-outline",
    //   color: "#FF3B30",
    //   onPress: () => Alert.alert("Coming soon"),
    //   enabled: true,
    // },
    // {
    //   id: "storage",
    //   title: "Storage",
    //   icon: "hardware-chip-outline",
    //   color: "#AF52DE",
    //   onPress: () => Alert.alert("Coming soon"),
    //   enabled: false,
    // },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("/(tabs)/profile")}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Preferences Section */}
        {toggleItems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            {toggleItems.map((item) => {
              const isEnabled = item.enabled !== false;

              return (
                <View key={item.id} style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <View
                      style={[
                        styles.iconContainer,
                        { backgroundColor: `${item.color}15` },
                        !isEnabled && styles.iconContainerDisabled,
                      ]}
                    >
                      <Ionicons
                        name={item.icon as any}
                        size={22}
                        color={!isEnabled ? "#C6C6C8" : item.color}
                      />
                    </View>
                    <Text
                      style={[
                        styles.settingTitle,
                        !isEnabled && styles.settingTitleDisabled,
                      ]}
                    >
                      {item.title}
                      {!isEnabled && " (Coming Soon)"}
                    </Text>
                  </View>
                  <Switch
                    value={item.value}
                    onValueChange={isEnabled ? item.onToggle : undefined}
                    trackColor={{ false: "#E5E5EA", true: "#007AFF" }}
                    thumbColor="#fff"
                    disabled={!isEnabled}
                  />
                </View>
              );
            })}
          </View>
        )}

        {/* App Settings Section */}
        {linkItems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>App Settings</Text>
            {linkItems.map((item) => {
              const isEnabled = item.enabled !== false;

              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.settingItem}
                  onPress={() => {
                    if (isEnabled) {
                      item.onPress();
                    }
                  }}
                  disabled={!isEnabled}
                  activeOpacity={isEnabled ? 0.7 : 1}
                >
                  <View style={styles.settingLeft}>
                    <View
                      style={[
                        styles.iconContainer,
                        { backgroundColor: `${item.color}15` },
                        !isEnabled && styles.iconContainerDisabled,
                      ]}
                    >
                      <Ionicons
                        name={item.icon as any}
                        size={22}
                        color={!isEnabled ? "#C6C6C8" : item.color}
                      />
                    </View>
                    <Text
                      style={[
                        styles.settingTitle,
                        !isEnabled && styles.settingTitleDisabled,
                      ]}
                    >
                      {item.title}
                      {!isEnabled && " (Coming Soon)"}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={!isEnabled ? "#E5E5EA" : "#C6C6C8"}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <TouchableOpacity
            style={styles.dangerItem}
            onPress={() =>
              Alert.alert(
                "Clear All Data",
                "This action cannot be undone. Are you sure?",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Clear",
                    style: "destructive",
                    onPress: () => {
                      // TODO: Implement clear data
                      Alert.alert("Success", "All data has been cleared");
                    },
                  },
                ],
              )
            }
          >
            <View style={styles.settingLeft}>
              <View
                style={[styles.iconContainer, { backgroundColor: "#FF3B3015" }]}
              >
                <Ionicons name="trash-outline" size={22} color="#FF3B30" />
              </View>
              <Text style={styles.dangerText}>Clear All Data</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#C6C6C8" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#333",
  },
  section: { marginBottom: 32 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93",
    textTransform: "uppercase",
    marginHorizontal: 20,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  settingLeft: { flexDirection: "row", alignItems: "center" },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconContainerDisabled: {
    opacity: 0.5,
  },
  settingTitle: { fontSize: 16, color: "#333" },
  settingTitleDisabled: {
    color: "#C6C6C8",
  },
  dangerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  dangerText: { fontSize: 16, color: "#FF3B30" },
});
