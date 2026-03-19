import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import "../global.css";

const { width } = Dimensions.get("window");

const INTERESTS = [
  { label: "Dance", icon: "accessibility" as const },
  { label: "Outgoing", icon: "globe" as const },
  { label: "Photography", icon: "camera" as const },
  { label: "Partying", icon: "sparkles" as const },
];

export default function Profile() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingTop: 50, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with back button + title */}
        <View className="mb-5 flex-row items-center justify-center">
          <TouchableOpacity
            className="absolute left-0"
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={28} color="#111827" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-black">My Profile</Text>
        </View>

        {/* Profile Photo */}
        <View className="mb-5 items-center">
          <Image
            source={require("../assets/images/profile_photo.png")}
            className="w-full rounded-2xl"
            style={{ height: width - 64, resizeMode: "cover" }}
          />
        </View>

        {/* Name */}
        <Text className="text-center text-2xl font-bold text-black">
          Katya Harris
        </Text>

        {/* Age */}
        <Text className="mb-4 text-center text-base text-gray-500">17</Text>

        {/* Divider */}
        <View className="mx-4 mb-4 h-px bg-gray-200" />

        {/* University & City */}
        <View className="mb-4 flex-row items-start justify-center gap-10">
          <View className="items-center">
            <Ionicons name="school" size={24} color="#111827" />
            <Text className="mt-1 text-sm text-black">
              University of Tartu
            </Text>
          </View>
          <View className="items-center">
            <Ionicons name="business" size={24} color="#111827" />
            <Text className="mt-1 text-sm text-black">Tartu</Text>
          </View>
        </View>

        {/* Divider */}
        <View className="mx-4 mb-5 h-px bg-gray-200" />

        {/* About section */}
        <Text className="mb-4 text-center text-base font-semibold text-black">
          About Mai ✨
        </Text>

        {/* Interest pills */}
        <View className="items-center">
          {INTERESTS.map((interest) => (
            <View
              key={interest.label}
              className="mb-3 flex-row items-center rounded-full border border-gray-300 px-6 py-2.5"
            >
              <Ionicons
                name={interest.icon}
                size={18}
                color="#111827"
                style={{ marginRight: 8 }}
              />
              <Text className="text-sm font-medium text-black">
                {interest.label}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-around border-t border-gray-200 bg-white pb-6 pt-3">
        <TouchableOpacity
          className="items-center"
          onPress={() => router.push("/" as any)}
        >
          <Ionicons name="home" size={26} color="#9ca3af" />
        </TouchableOpacity>
        <TouchableOpacity
          className="items-center"
          onPress={() => router.push("/chat" as any)}
        >
          <Ionicons name="chatbubble" size={26} color="#9ca3af" />
        </TouchableOpacity>
        <TouchableOpacity
          className="items-center"
          onPress={() => router.push("/settings" as any)}
        >
          <Ionicons name="settings-sharp" size={26} color="#9ca3af" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
