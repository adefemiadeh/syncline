import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  Linking,
  Modal,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function HelpSupportScreen() {
  const router = useRouter();
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
  const insets = useSafeAreaInsets();
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackRating, setFeedbackRating] = useState<number>(0);

  const faqs = [
    {
      question: "How do I connect a new platform?",
      answer:
        "Go to Profile → Connected Platforms → Select the platform you want to connect → Follow the OAuth authorization flow.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes! We use OAuth 2.0 for authentication and never store your passwords. All data is encrypted in transit and at rest.",
    },
    {
      question: "How often are messages synced?",
      answer:
        "Messages sync in real-time for most platforms. You'll receive notifications within seconds of receiving a new message.",
    },
    {
      question: "Can I reply to messages from Syncline?",
      answer:
        "Yes! Syncline supports replying to messages from connected platforms. Your reply will be sent through the original platform.",
    },
    {
      question: "What platforms are supported?",
      answer:
        "Currently we support Slack, Discord, WhatsApp, Telegram, and Gmail. More platforms coming soon!",
    },
    {
      question: "How do I delete my account?",
      answer:
        "Go to Settings → Danger Zone → Delete Account. This will permanently remove all your data from Syncline.",
    },
  ];

  const handleContactSupport = () => {
    Linking.openURL(
      "mailto:support@syncline.com?subject=Syncline%20Support%20Request",
    );
  };

  const handleSubmitFeedback = () => {
    if (!feedback.trim()) {
      Alert.alert("Error", "Please enter your feedback");
      return;
    }

    // TODO: Send to backend
    console.log("Feedback submitted:", { rating: feedbackRating, feedback });
    Alert.alert("Thank You!", "Your feedback helps us improve Syncline.", [
      {
        text: "OK",
        onPress: () => {
          setShowFeedbackModal(false);
          setFeedback("");
          setFeedbackRating(0);
        },
      },
    ]);
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message:
          "Check out Syncline! It's the best way to manage all your messages in one place. https://syncline.com/download",
        title: "Share Syncline",
      });
    } catch (error) {
      Alert.alert("Error", "Could not share the app");
    }
  };

  const handleRateApp = () => {
    // TODO: Link to app store rating
    Linking.openURL("https://apps.apple.com/app/syncline");
    Alert.alert("Rate Syncline", "Thank you for supporting us!");
  };

  const handleReportBug = () => {
    Linking.openURL(
      "mailto:bugs@syncline.com?subject=Bug%20Report%20-%20Syncline",
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.replace("/(tabs)/profile")}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help & Support</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={handleContactSupport}
          >
            <View style={[styles.actionIcon, { backgroundColor: "#007AFF15" }]}>
              <Ionicons name="mail-outline" size={28} color="#007AFF" />
            </View>
            <Text style={styles.actionTitle}>Contact Us</Text>
            <Text style={styles.actionSubtitle}>Email support team</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => setShowFeedbackModal(true)}
          >
            <View style={[styles.actionIcon, { backgroundColor: "#FF950015" }]}>
              <Ionicons name="chatbubble-outline" size={28} color="#FF9500" />
            </View>
            <Text style={styles.actionTitle}>Send Feedback</Text>
            <Text style={styles.actionSubtitle}>Help us improve</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={handleReportBug}>
            <View style={[styles.actionIcon, { backgroundColor: "#FF3B3015" }]}>
              <Ionicons name="bug-outline" size={28} color="#FF3B30" />
            </View>
            <Text style={styles.actionTitle}>Report Bug</Text>
            <Text style={styles.actionSubtitle}>Report an issue</Text>
          </TouchableOpacity>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {faqs.map((faq, index) => (
            <View key={index} style={styles.faqItem}>
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              <Text style={styles.faqAnswer}>{faq.answer}</Text>
            </View>
          ))}
        </View>

        {/* Resources Section */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resources</Text>

          <TouchableOpacity
            style={styles.resourceItem}
            onPress={() => Linking.openURL("https://syncline.com/docs")}
          >
            <View style={styles.resourceLeft}>
              <Ionicons
                name="document-text-outline"
                size={22}
                color="#007AFF"
              />
              <Text style={styles.resourceText}>Documentation</Text>
            </View>
            <Ionicons name="open-outline" size={20} color="#C6C6C8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resourceItem}
            onPress={() => Linking.openURL("https://syncline.com/status")}
          >
            <View style={styles.resourceLeft}>
              <Ionicons name="server-outline" size={22} color="#34C759" />
              <Text style={styles.resourceText}>System Status</Text>
            </View>
            <Ionicons name="open-outline" size={20} color="#C6C6C8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resourceItem}
            onPress={() => Linking.openURL("https://syncline.com/privacy")}
          >
            <View style={styles.resourceLeft}>
              <Ionicons name="shield-outline" size={22} color="#5856D6" />
              <Text style={styles.resourceText}>Privacy Policy</Text>
            </View>
            <Ionicons name="open-outline" size={20} color="#C6C6C8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resourceItem}
            onPress={() => Linking.openURL("https://syncline.com/terms")}
          >
            <View style={styles.resourceLeft}>
              <Ionicons name="document-outline" size={22} color="#FF9500" />
              <Text style={styles.resourceText}>Terms of Service</Text>
            </View>
            <Ionicons name="open-outline" size={20} color="#C6C6C8" />
          </TouchableOpacity>
        </View> */}

        {/* Community Section */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community</Text>

          <TouchableOpacity
            style={styles.resourceItem}
            onPress={() => Linking.openURL("https://discord.gg/syncline")}
          >
            <View style={styles.resourceLeft}>
              <Ionicons name="logo-discord" size={22} color="#5865F2" />
              <Text style={styles.resourceText}>Join our Discord</Text>
            </View>
            <Ionicons name="open-outline" size={20} color="#C6C6C8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resourceItem}
            onPress={() => Linking.openURL("https://github.com/syncline")}
          >
            <View style={styles.resourceLeft}>
              <Ionicons name="logo-github" size={22} color="#333" />
              <Text style={styles.resourceText}>GitHub Repository</Text>
            </View>
            <Ionicons name="open-outline" size={20} color="#C6C6C8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resourceItem}
            onPress={() => Linking.openURL("https://twitter.com/syncline")}
          >
            <View style={styles.resourceLeft}>
              <Ionicons name="logo-twitter" size={22} color="#1DA1F2" />
              <Text style={styles.resourceText}>Follow on X (Twitter)</Text>
            </View>
            <Ionicons name="open-outline" size={20} color="#C6C6C8" />
          </TouchableOpacity>
        </View> */}

        {/* Share & Rate */}
        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.shareButton} onPress={handleShareApp}>
            <Ionicons name="share-social-outline" size={20} color="#007AFF" />
            <Text style={styles.shareButtonText}>Share Syncline</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity style={styles.rateButton} onPress={handleRateApp}>
            <Ionicons name="star-outline" size={20} color="#FF9500" />
            <Text style={styles.rateButtonText}>Rate Us</Text>
          </TouchableOpacity> */}
        </View>

        {/* Version Info */}
        <Text style={styles.versionText}>Version 1.0.0 • © 2024 Syncline</Text>
      </ScrollView>

      {/* Feedback Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={showFeedbackModal}
        onRequestClose={() => setShowFeedbackModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Send Feedback</Text>
              <TouchableOpacity onPress={() => setShowFeedbackModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLabel}>How would you rate Syncline?</Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setFeedbackRating(star)}
                >
                  <Ionicons
                    name={star <= feedbackRating ? "star" : "star-outline"}
                    size={32}
                    color={star <= feedbackRating ? "#FFD700" : "#C6C6C8"}
                    style={styles.star}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalLabel}>Your Feedback</Text>
            <TextInput
              style={styles.feedbackInput}
              multiline
              numberOfLines={5}
              placeholder="Tell us what you think..."
              value={feedback}
              onChangeText={setFeedback}
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmitFeedback}
            >
              <Text style={styles.submitButtonText}>Submit Feedback</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  quickActions: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
    gap: 12,
  },
  actionCard: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: "#8E8E93",
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  faqItem: {
    marginBottom: 20,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  resourceItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  resourceLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  resourceText: {
    fontSize: 16,
    color: "#333",
  },
  bottomActions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 32,
    gap: 12,
  },
  shareButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  rateButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
  },
  rateButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF9500",
  },
  versionText: {
    textAlign: "center",
    fontSize: 12,
    color: "#C6C6C8",
    marginTop: 24,
    marginBottom: 32,
  },
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
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    marginTop: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  star: {
    marginHorizontal: 4,
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    textAlignVertical: "top",
    minHeight: 100,
    backgroundColor: "#f9f9f9",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
