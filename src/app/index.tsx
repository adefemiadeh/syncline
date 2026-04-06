import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useUserStore } from "../store/userStore";

export default function IndexScreen() {
  const router = useRouter();
  const { user } = useUserStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(user ? "/home" : "/login");
    }, 1000);
    return () => clearTimeout(timer);
  }, [user, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.text}>Loading Syncline...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: { marginTop: 16, fontSize: 16, color: "#666" },
});
