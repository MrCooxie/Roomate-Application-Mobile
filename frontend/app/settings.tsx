import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import "../global.css";

export default function Settings() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingTop: 60, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text className="mb-5 text-center text-2xl font-bold text-black">
          Settings
        </Text>

        {/* Profile Avatar */}
        <View className="mb-4 items-center">
          <Image
            source={require("../assets/images/avatar_profile.png")}
            className="h-28 w-28 rounded-full"
            style={{ resizeMode: "cover" }}
          />
        </View>

        {/* Edit Profile Button */}
        <View className="mb-5 items-center">
          <TouchableOpacity
            className="flex-row items-center rounded-full border border-brand bg-brand px-8 py-3"
            onPress={() => router.push("/profile" as any)}
          >
            <Text className="mr-2 text-base font-semibold text-white">
              Edit Profile
            </Text>
            <Ionicons name="pencil" size={16} color="white" />
          </TouchableOpacity>
        </View>

        {/* Contacts */}
        <Text className="mb-4 text-center text-lg font-semibold text-black">
          Contacts
        </Text>

        <View className="mb-3 flex-row items-center px-4">
          <Ionicons name="call" size={20} color="#111827" />
          <Text className="ml-4 text-base text-black">+372 7390266</Text>
        </View>

        <View className="mb-5 flex-row items-center px-4">
          <Ionicons name="mail" size={20} color="#111827" />
          <Text className="ml-4 text-base text-black">
            Mai.leen@gmail.com
          </Text>
        </View>

        {/* Divider */}
        <View className="mx-4 h-px bg-gray-200" />
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
        <TouchableOpacity className="items-center">
          <Ionicons name="settings-sharp" size={26} color="#111827" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
