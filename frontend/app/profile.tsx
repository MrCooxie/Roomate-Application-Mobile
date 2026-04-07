import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
  ActivityIndicator,
} from "react-native";

const screenWidth = Dimensions.get("window").width;
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ScreenLayout from "../components/ScreenLayout";
import { getImageUri } from "../utils/getImageUri";
import { useAuth } from "../context/auth";
import { API_BASE } from "../config";
import "../global.css";

type ProfileData = {
  name: string;
  age: number;
  city: string;
  university: string;
  email: string;
  image: string | null;
  interests: { label: string; icon: string | null }[];
};

export default function Profile() {
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch(`${API_BASE}/profile/${user.airtableId}`)
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => console.error("Failed to fetch profile:", err))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <ScreenLayout activeRoute="settings">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#8EC19D" />
        </View>
      </ScreenLayout>
    );
  }

  const displayName = profile?.name || `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
  const interests = profile?.interests || [];

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
        {profile?.image ? (
          <View className="mx-auto mb-5 w-full max-w-md items-center">
            {Platform.OS === "web" ? (
              <View
                style={{
                  width: "100%",
                  aspectRatio: 3 / 4,
                  backgroundImage: `url(${profile.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center top",
                  borderRadius: 16,
                } as any}
              />
            ) : (
              <Image
                source={{ uri: profile.image }}
                style={{ width: screenWidth - 40, height: screenWidth - 40, borderRadius: 16 }}
                resizeMode="cover"
              />
            )}
          </View>
        ) : (
          <View className="mx-auto mb-5 h-48 w-48 items-center justify-center rounded-full bg-gray-200">
            <Ionicons name="person" size={64} color="#9ca3af" />
          </View>
        )}

        {/* Name */}
        <Text className="text-center text-2xl font-bold text-black">
          {displayName}
        </Text>

        {/* Age */}
        {profile?.age ? (
          <Text className="mb-4 text-center text-base text-gray-500">{profile.age}</Text>
        ) : null}

        {/* Divider */}
        <View className="mx-4 mb-4 h-px bg-gray-200" />

        {/* University & City */}
        <View className="mb-4 flex-row items-start justify-center gap-10">
          {profile?.university ? (
            <View className="items-center">
              <Ionicons name="school" size={24} color="#111827" />
              <Text className="mt-1 text-sm text-black">
                {profile.university}
              </Text>
            </View>
          ) : null}
          {profile?.city ? (
            <View className="items-center">
              <Ionicons name="business" size={24} color="#111827" />
              <Text className="mt-1 text-sm text-black">{profile.city}</Text>
            </View>
          ) : null}
        </View>

        {/* Divider */}
        <View className="mx-4 mb-5 h-px bg-gray-200" />

        {/* About section */}
        {interests.length > 0 && (
          <>
            <Text className="mb-4 text-center text-base font-semibold text-black">
              Interests
            </Text>

            {/* Interest pills */}
            <View className="items-center">
              {interests.map((interest) => (
                <View
                  key={interest.label}
                  className="mb-3 flex-row items-center rounded-full border border-gray-300 px-6 py-2.5"
                >
                  {interest.icon ? (
                    <Image
                      source={{ uri: interest.icon }}
                      style={{ width: 18, height: 18, marginRight: 8 }}
                    />
                  ) : (
                    <Ionicons
                      name="sparkles"
                      size={18}
                      color="#111827"
                      style={{ marginRight: 8 }}
                    />
                  )}
                  <Text className="text-sm font-medium text-black">
                    {interest.label}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </ScreenLayout>
  );
}
