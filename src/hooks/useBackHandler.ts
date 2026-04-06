import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Alert, BackHandler } from "react-native";

export const useBackHandler = (shouldHandleBack: boolean = true) => {
  const router = useRouter();

  useEffect(() => {
    if (!shouldHandleBack) return;

    const backAction = () => {
      Alert.alert("Exit App", "Are you sure you want to exit?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        {
          text: "Exit",
          onPress: () => BackHandler.exitApp(),
          style: "destructive",
        },
      ]);
      return true; // Return true to prevent default behavior
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => backHandler.remove();
  }, [shouldHandleBack]);
};
