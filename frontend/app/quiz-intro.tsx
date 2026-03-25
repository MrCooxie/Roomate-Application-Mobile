import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import "../global.css";

export default function QuizIntro() {
  const router = useRouter();

  const handleLetsGo = () => {
    router.push("/quiz-profile" as any);
  };

  return (
    <View className="flex-1 items-center bg-white" style={{ paddingTop: 70 }}>
      <View style={{ width: "100%", maxWidth: 430, paddingHorizontal: 32, flex: 1 }}>
      {/* App name */}
      <Text className="mb-8 text-center text-3xl font-bold italic text-gray-900">
        Roomy.
      </Text>

      {/* Illustration */}
      <View className="mb-8 items-center">
        <Image
          source={require("../assets/images/quiz_intro.png")}
          style={{ width: 300, height: 300, resizeMode: "contain" }}
        />
      </View>

      {/* Description */}
      <Text className="mb-4 text-center text-lg font-semibold text-gray-900" style={{ lineHeight: 28 }}>
        Take a quick quiz to set up your{"\n"}account
      </Text>

      {/* Spacer to push button to bottom */}
      <View className="flex-1" />

      {/* Let's go button */}
      <TouchableOpacity
        className="mb-12 items-center rounded-full bg-brand py-4"
        onPress={handleLetsGo}
      >
        <Text className="text-base font-semibold text-white">Let's go!</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}
