import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBackHandler } from "../../hooks/useBackHandler";
import { useUserStore } from "../../store/userStore";

export default function ProfileScreen() {
  useBackHandler(true);
  const router = useRouter();
  const { user, updateUser, logout } = useUserStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isAvatarModalVisible, setIsAvatarModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: user?.fullName || "",
    bio: user?.bio || "",
    location: user?.location || "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsLoading(true);

    updateUser({
      fullName: editForm.fullName,
      bio: editForm.bio,
      location: editForm.location,
    });

    setIsLoading(false);
    setIsEditing(false);
    Alert.alert("Success", "Profile updated successfully!");
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant access to your photos");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && user) {
      updateUser({ avatar: result.assets[0].uri });
      setIsAvatarModalVisible(false);
      Alert.alert("Success", "Profile picture updated!");
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant access to your camera");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && user) {
      updateUser({ avatar: result.assets[0].uri });
      setIsAvatarModalVisible(false);
      Alert.alert("Success", "Profile picture updated!");
    }
  };

  const handleRemovePhoto = () => {
    if (user) updateUser({ avatar: undefined });
    setIsAvatarModalVisible(false);
    Alert.alert("Success", "Profile picture removed");
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          logout();
          router.replace("/login");
        },
      },
    ]);
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setIsAvatarModalVisible(true)}
            style={styles.profileImageContainer}
          >
            {user.avatar ? (
              <Image
                source={{ uri: user.avatar }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileImageText}>
                  {getInitials(user.fullName)}
                </Text>
              </View>
            )}
            <View style={styles.editPhotoBadge}>
              <Ionicons name="camera" size={16} color="#fff" />
            </View>
          </TouchableOpacity>

          <Text style={styles.userName}>{user.fullName}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          {user.bio && <Text style={styles.userBio}>{user.bio}</Text>}

          {user.location && (
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={14} color="#8E8E93" />
              <Text style={styles.locationText}>{user.location}</Text>
            </View>
          )}

          <View style={styles.joinDateContainer}>
            <Ionicons name="calendar-outline" size={14} color="#8E8E93" />
            <Text style={styles.joinDateText}>Joined {user.joinDate}</Text>
          </View>

          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {[
            // {
            //   title: "Notifications",
            //   icon: "notifications-outline",
            //   color: "#FF9500",
            //   onPress: () => Alert.alert("Coming soon"),
            // },
            // {
            //   title: "Privacy & Security",
            //   icon: "lock-closed-outline",
            //   color: "#34C759",
            //   onPress: () => Alert.alert("Coming soon"),
            // },
            {
              title: "Connected Platforms",
              icon: "share-outline",
              color: "#5856D6",
              onPress: () => router.replace("/(tabs)/connected-platforms"), // Update this line
            },
            {
              title: "Help & Support",
              icon: "help-circle-outline",
              color: "#FF3B30",
              onPress: () => router.replace("/(tabs)/help-support"), // Update this line
            },
            {
              title: "Settings",
              icon: "settings-outline",
              color: "#5856D6",
              onPress: () => router.replace("/(tabs)/settings"), // Update this line
            },
            {
              title: "About Syncline",
              icon: "information-circle-outline",
              color: "#8E8E93",
              onPress: () => Alert.alert("Syncline v1.0.0"),
            },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View
                style={[
                  styles.menuIconContainer,
                  { backgroundColor: `${item.color}15` },
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={22}
                  color={item.color}
                />
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={20} color="#C6C6C8" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={isEditing}
        onRequestClose={() => setIsEditing(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setIsEditing(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              value={editForm.fullName}
              onChangeText={(text) =>
                setEditForm({ ...editForm, fullName: text })
              }
              placeholder="Full Name"
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              value={editForm.bio}
              onChangeText={(text) => setEditForm({ ...editForm, bio: text })}
              placeholder="Bio"
              multiline
            />
            <TextInput
              style={styles.input}
              value={editForm.location}
              onChangeText={(text) =>
                setEditForm({ ...editForm, location: text })
              }
              placeholder="Location"
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveProfile}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Avatar Modal */}
      <Modal
        animationType="fade"
        transparent
        visible={isAvatarModalVisible}
        onRequestClose={() => setIsAvatarModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.avatarModalContent}>
            <Text style={styles.avatarModalTitle}>Profile Picture</Text>

            <TouchableOpacity
              style={styles.avatarOption}
              onPress={handleTakePhoto}
            >
              <Ionicons name="camera" size={24} color="#007AFF" />
              <Text style={styles.avatarOptionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.avatarOption}
              onPress={handlePickImage}
            >
              <Ionicons name="images" size={24} color="#007AFF" />
              <Text style={styles.avatarOptionText}>Choose from Library</Text>
            </TouchableOpacity>

            {user.avatar && (
              <TouchableOpacity
                style={styles.avatarOption}
                onPress={handleRemovePhoto}
              >
                <Ionicons name="trash-outline" size={24} color="#FF3B30" />
                <Text style={[styles.avatarOptionText, { color: "#FF3B30" }]}>
                  Remove Photo
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.avatarCancelButton}
              onPress={() => setIsAvatarModalVisible(false)}
            >
              <Text style={styles.avatarCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Paste your original Profile styles here (they are already very good)
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  profileImageContainer: { position: "relative", marginBottom: 16 },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImageText: { fontSize: 40, fontWeight: "bold", color: "#fff" },
  editPhotoBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007AFF",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  userEmail: { fontSize: 14, color: "#8E8E93", marginBottom: 8 },
  userBio: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 32,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  locationText: { fontSize: 12, color: "#8E8E93" },
  joinDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 16,
  },
  joinDateText: { fontSize: 12, color: "#8E8E93" },
  editProfileButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: "#F2F2F7",
    borderRadius: 20,
  },
  editProfileText: { fontSize: 14, color: "#007AFF", fontWeight: "500" },
  menuContainer: { paddingHorizontal: 20, marginBottom: 24 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuTitle: { flex: 1, fontSize: 16, color: "#333" },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#FFF2F0",
    borderRadius: 12,
    gap: 8,
    marginBottom: 16,
  },
  logoutText: { fontSize: 16, color: "#FF3B30", fontWeight: "600" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
  },
  textArea: { minHeight: 80, textAlignVertical: "top" },
  saveButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  avatarModalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "80%",
  },
  avatarModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  avatarOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  avatarOptionText: { fontSize: 16, color: "#007AFF" },
  avatarCancelButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  avatarCancelText: { fontSize: 16, color: "#8E8E93" },
});
