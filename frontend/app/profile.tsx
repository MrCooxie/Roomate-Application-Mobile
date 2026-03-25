import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";

const screenWidth = Dimensions.get("window").width;
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ScreenLayout from "../components/ScreenLayout";
import { getImageUri } from "../utils/getImageUri";
import "../global.css";

const INTERESTS = [
  { label: "Dance", icon: "accessibility" as const },
  { label: "Outgoing", icon: "globe" as const },
  { label: "Photography", icon: "camera" as const },
  { label: "Partying", icon: "sparkles" as const },
];

export default function Profile() {
  const router = useRouter();

  return (
    <ScreenLayout activeRoute="settings">
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}
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
        <View className="mx-auto mb-5 w-full max-w-md items-center">
          {Platform.OS === "web" ? (
            <View
              style={{
                width: "100%",
                aspectRatio: 3 / 4,
                backgroundImage: `url(${getImageUri(require("../assets/images/profile_photo.png"))})`,
                backgroundSize: "cover",
                backgroundPosition: "center top",
                borderRadius: 16,
              } as any}
            />
          ) : (
            <Image
              source={require("../assets/images/profile_photo.png")}
              style={{ width: screenWidth - 40, height: screenWidth - 40, borderRadius: 16 }}
              resizeMode="cover"
            />
          )}
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
    </ScreenLayout>
  );
}
