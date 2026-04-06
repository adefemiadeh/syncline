import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8E8E93",
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#F0F0F0",
          elevation: 0,
          shadowOpacity: 0,
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      {/* Inbox Tab */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Inbox",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Hidden Screens (accessed via navigation) */}
      <Tabs.Screen
        name="chat"
        options={{
          href: null, // Hides from bottom tab bar
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          href: null, // Hides from bottom tab bar
        }}
      />

      <Tabs.Screen
        name="connected-platforms"
        options={{
          href: null, // Hides from bottom tab bar
        }}
      />

      <Tabs.Screen
        name="help-support"
        options={{
          href: null, // Hides from bottom tab bar
        }}
      />
    </Tabs>
  );
}
