import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSettingsStore } from "../../store/settingsStore";

export default function SettingsScreen() {
  const {
    pushNotifications,
    darkMode,
    emailNotifications,
    togglePush,
    toggleDarkMode,
    toggleEmail,
  } = useSettingsStore();

  const settingsSections = [
    {
      title: "Preferences",
      items: [
        {
          id: "push",
          title: "Push Notifications",
          icon: "notifications-outline",
          color: "#007AFF",
          type: "toggle" as const,
          value: pushNotifications,
          onToggle: togglePush,
        },
        // {
        //   id: "dark",
        //   title: "Dark Mode",
        //   icon: "moon-outline",
        //   color: "#5856D6",
        //   type: "toggle" as const,
        //   value: darkMode,
        //   onToggle: toggleDarkMode,
        // },
        // {
        //   id: "email",
        //   title: "Email Notifications",
        //   icon: "mail-outline",
        //   color: "#34C759",
        //   type: "toggle" as const,
        //   value: emailNotifications,
        //   onToggle: toggleEmail,
        // },
      ],
    },
    // {
    //   title: "App Settings",
    //   items: [
    //     {
    //       id: "language",
    //       title: "Language",
    //       icon: "language-outline",
    //       color: "#FF9500",
    //       type: "link" as const,
    //       onPress: () => Alert.alert("Coming soon"),
    //     },
    //     {
    //       id: "data",
    //       title: "Data Usage",
    //       icon: "cellular-outline",
    //       color: "#FF3B30",
    //       type: "link" as const,
    //       onPress: () => Alert.alert("Coming soon"),
    //     },
    //     {
    //       id: "storage",
    //       title: "Storage",
    //       icon: "hardware-chip-outline",
    //       color: "#AF52DE",
    //       type: "link" as const,
    //       onPress: () => Alert.alert("Coming soon"),
    //     },
    //   ],
    // },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        {settingsSections.map((section, idx) => (
          <View key={idx} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((item) => (
              <View key={item.id} style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: `${item.color}15` },
                    ]}
                  >
                    <Ionicons
                      name={item.icon as any}
                      size={22}
                      color={item.color}
                    />
                  </View>
                  <Text style={styles.settingTitle}>{item.title}</Text>
                </View>
                {item.type === "toggle" ? (
                  <Switch
                    value={item.value}
                    onValueChange={item.onToggle}
                    trackColor={{ false: "#E5E5EA", true: "#007AFF" }}
                    thumbColor="#fff"
                  />
                ) : (
                  <Ionicons name="chevron-forward" size={20} color="#C6C6C8" />
                )}
              </View>
            ))}
          </View>
        ))}

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <TouchableOpacity
            style={styles.dangerItem}
            onPress={() =>
              Alert.alert("Clear All Data", "This action cannot be undone.")
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
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 },
  headerTitle: { fontSize: 34, fontWeight: "bold", color: "#333" },
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
  settingTitle: { fontSize: 16, color: "#333" },
  dangerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  dangerText: { fontSize: 16, color: "#FF3B30" },
});
