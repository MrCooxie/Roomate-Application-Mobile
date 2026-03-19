import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ROOMMATES } from "../../data/roommates";
import "../../global.css";

const { width } = Dimensions.get("window");

export default function RoommateDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const roommate = ROOMMATES.find((r) => r.id === id);

  if (!roommate) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-lg text-gray-500">Roommate not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: 50, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header – back button + "Meet Name" */}
        <View className="mb-5 flex-row items-center px-5">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="chevron-back" size={26} color="#111827" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-black">
            👋  Meet {roommate.firstName}
          </Text>
        </View>

        {/* Profile photo with compatibility badge */}
        <View className="mx-8 mb-5">
          <View className="relative overflow-hidden rounded-3xl">
            <Image
              source={roommate.image}
              className="w-full rounded-3xl"
              style={{ height: width - 64, resizeMode: "cover" }}
            />
          </View>
          {/* Compatibility badge – positioned at top-right outside the rounded image slightly */}
          <View className="absolute -top-2 -right-2 h-14 w-14 items-center justify-center rounded-full bg-emerald-400">
            <Text className="text-sm font-bold text-white">
              {roommate.compatibility}%
            </Text>
          </View>
        </View>

        {/* Name & Age */}
        <Text className="mb-0.5 text-center text-2xl font-bold text-black">
          {roommate.name}
        </Text>
        <Text className="mb-4 text-center text-base text-gray-500">
          {roommate.age}
        </Text>

        {/* Divider */}
        <View className="mx-8 mb-4 border-b border-gray-200" />

        {/* University & City row */}
        <View className="mx-8 mb-4 flex-row items-start justify-center gap-10">
          <View className="items-center">
            <Ionicons name="school-outline" size={24} color="#111827" />
            <Text className="mt-1 text-sm text-gray-700">
              {roommate.university}
            </Text>
          </View>
          <View className="items-center">
            <Ionicons name="grid-outline" size={24} color="#111827" />
            <Text className="mt-1 text-sm text-gray-700">{roommate.city}</Text>
          </View>
        </View>

        {/* Divider */}
        <View className="mx-8 mb-4 border-b border-gray-200" />

        {/* About section */}
        <Text className="mb-4 text-center text-base font-semibold text-black">
          About {roommate.firstName} ✨
        </Text>

        {/* Interest tags */}
        <View className="items-center gap-3 px-8">
          {roommate.interests.map((interest, idx) => (
            <View
              key={idx}
              className="flex-row items-center gap-3 rounded-full border border-gray-300 px-6 py-3"
            >
              <Ionicons
                name={interest.icon as any}
                size={20}
                color="#111827"
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
        <TouchableOpacity className="items-center">
          <Ionicons name="home" size={26} color="#111827" />
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Ionicons name="chatbubble" size={26} color="#9ca3af" />
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Ionicons name="settings-sharp" size={26} color="#9ca3af" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
