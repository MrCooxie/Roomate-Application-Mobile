import { View, Text, Image, ScrollView, TouchableOpacity, Platform, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useData } from "../../context/data";
import ScreenLayout from "../../components/ScreenLayout";
import "../../global.css";

import { getImageUri } from "../../utils/getImageUri";

export default function RoommateDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { roommates } = useData();
  const roommate = roommates.find((r) => r.id === id);

  if (!roommate) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-lg text-gray-500">Roommate not found</Text>
      </View>
    );
  }

  return (
    <ScreenLayout activeRoute="home">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}
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
        <View className="mx-auto mb-5 w-full max-w-md px-8">
          <View className="relative overflow-hidden rounded-3xl">
            {Platform.OS === "web" ? (
              <View
                style={{
                  width: "100%",
                  aspectRatio: 3 / 4,
                  backgroundImage: `url(${getImageUri(roommate.image)})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center top",
                  borderRadius: 24,
                } as any}
              />
            ) : (
              <Image
                source={typeof roommate.image === "string" ? { uri: roommate.image } : roommate.image}
                style={{ width: screenWidth - 64, height: screenWidth - 64, borderRadius: 24 }}
                resizeMode="cover"
              />
            )}
            {/* Compatibility badge */}
            <View className="absolute top-3 right-3 h-14 w-14 items-center justify-center rounded-full bg-brand">
              <Text className="text-sm font-bold text-white">
                {roommate.compatibility}%
              </Text>
            </View>
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
    </ScreenLayout>
  );
}
