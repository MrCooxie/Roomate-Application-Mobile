import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,

} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ScreenLayout from "../components/ScreenLayout";
import { useAuth } from "../context/auth";
import { API_BASE } from "../config";
import "../global.css";

export default function Settings() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetch(`${API_BASE}/profile/${user.airtableId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.image) setProfileImage(data.image);
      })
      .catch(() => {});
  }, [user]);

  const displayName = user ? `${user.firstName} ${user.lastName}`.trim() : "";

  return (
    <ScreenLayout activeRoute="settings">
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text className="mb-5 text-center text-2xl font-bold text-black">
          Settings
        </Text>

        {/* Profile Avatar */}
        <View className="mb-4 items-center">
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={{ width: 112, height: 112, borderRadius: 56 }}
              resizeMode="cover"
            />
          ) : (
            <View
              style={{ width: 112, height: 112, borderRadius: 56 }}
              className="items-center justify-center bg-gray-200"
            >
              <Ionicons name="person" size={48} color="#9ca3af" />
            </View>
          )}
        </View>

        {/* User Name */}
        {displayName ? (
          <Text className="mb-2 text-center text-lg font-semibold text-black">
            {displayName}
          </Text>
        ) : null}

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

        {user?.email ? (
          <View className="mb-5 flex-row items-center px-4">
            <Ionicons name="mail" size={20} color="#111827" />
            <Text className="ml-4 text-base text-black">{user.email}</Text>
          </View>
        ) : null}

        {/* Divider */}
        <View className="mx-4 mb-5 h-px bg-gray-200" />

        {/* Logout Button */}
        <View className="items-center">
          <TouchableOpacity
            className="flex-row items-center rounded-full border border-red-400 px-8 py-3"
            onPress={logout}
          >
            <Ionicons name="log-out-outline" size={20} color="#ef4444" style={{ marginRight: 8 }} />
            <Text className="text-base font-semibold text-red-500">
              Log out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}
