import { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;
import { Apartment } from "../data/apartments";
import { Roommate } from "../data/roommates";
import { useResponsiveColumns } from "../hooks/useResponsiveColumns";
import { useData } from "../context/data";
import ScreenLayout from "../components/ScreenLayout";
import "../global.css";

import { getImageUri } from "../utils/getImageUri";

// ─── Shared components ───────────────────────────────────────────────

function CompatibilityBadge({ value }: { value: number }) {
  const bgColor = value >= 70 ? "bg-brand" : "bg-yellow-600/80";

  return (
    <View
      className={`absolute top-3 right-3 z-10 h-12 w-12 items-center justify-center rounded-full ${bgColor}`}
    >
      <Text className="text-sm font-bold text-white">{value}%</Text>
    </View>
  );
}

// ─── Roommate card ───────────────────────────────────────────────────

function RoommateCard({ roommate, onPress }: { roommate: Roommate; onPress: () => void }) {
  const [liked, setLiked] = useState(false);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} className="mb-2 border-b border-gray-200 pb-4">
      <Text className="mb-2 text-xl font-bold text-black">
        {roommate.name}, {roommate.age}
      </Text>

      <View className="relative mb-3 overflow-hidden rounded-2xl">
        <CompatibilityBadge value={roommate.compatibility} />
        {Platform.OS === "web" ? (
          <View
            style={{
              width: "100%",
              aspectRatio: 3 / 4,
              backgroundImage: `url(${getImageUri(roommate.image)})`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
              borderRadius: 16,
            } as any}
          />
        ) : (
          <Image
            source={typeof roommate.image === "string" ? { uri: roommate.image } : roommate.image}
            style={{ width: screenWidth - 40, height: screenWidth - 40, borderRadius: 16 }}
            resizeMode="cover"
          />
        )}
      </View>

      <View className="flex-row items-end justify-between">
        <View>
          <Text className="text-base text-gray-600">{roommate.city}</Text>
          <Text className="text-base font-medium text-gray-800">
            {roommate.university}
          </Text>
        </View>
        <TouchableOpacity onPress={(e) => { e.stopPropagation(); setLiked(!liked); }}>
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={26}
            color={liked ? "#f87171" : "#9ca3af"}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

// ─── Apartment card ──────────────────────────────────────────────────

function ApartmentCard({ apartment, onPress }: { apartment: Apartment; onPress: () => void }) {
  const [liked, setLiked] = useState(false);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} className="mb-2 border-b border-gray-200 pb-4">
      <Text className="mb-2 text-xl font-bold text-black">
        {apartment.address}
      </Text>

      <View className="relative mb-3 overflow-hidden rounded-2xl">
        {Platform.OS === "web" ? (
          <View
            style={{
              width: "100%",
              aspectRatio: 1,
              backgroundImage: `url(${getImageUri(apartment.image)})`,
              backgroundSize: "cover",
              backgroundPosition: "center center",
              borderRadius: 16,
            } as any}
          />
        ) : (
          <Image
            source={typeof apartment.image === "string" ? { uri: apartment.image } : apartment.image}
            style={{ width: screenWidth - 40, height: screenWidth - 40, borderRadius: 16 }}
            resizeMode="cover"
          />
        )}
      </View>

      <View className="flex-row items-end justify-between">
        <View>
          <Text className="text-base text-gray-600">{apartment.priceLabel}</Text>
          <Text className="text-base font-medium text-gray-800">
            Up to {apartment.maxTenants} tenants
          </Text>
        </View>
        <TouchableOpacity onPress={(e) => { e.stopPropagation(); setLiked(!liked); }}>
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={26}
            color={liked ? "#f87171" : "#9ca3af"}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────

type Tab = "Roommates" | "Apartments";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("Roommates");
  const router = useRouter();
  const { columns, cardWidth } = useResponsiveColumns();

  const { roommates: displayRoommates, apartments: displayApartments } = useData();

  return (
    <ScreenLayout activeRoute="home">
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title – changes based on active tab */}
        <Text className="mb-5 text-center text-2xl font-bold text-black">
          {activeTab === "Roommates" ? "Find roommates" : "Find apartments"}
        </Text>

        {/* Tabs */}
        <View className="mb-6 flex-row gap-3">
          <TouchableOpacity
            onPress={() => setActiveTab("Roommates")}
            className={`flex-1 items-center rounded-full border py-3 ${activeTab === "Roommates"
              ? "border-brand bg-brand"
              : "border-gray-300 bg-white"
              }`}
          >
            <Text
              className={`text-base font-semibold ${activeTab === "Roommates" ? "text-white" : "text-gray-700"
                }`}
            >
              Roommates
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("Apartments")}
            className={`flex-1 items-center rounded-full border py-3 ${activeTab === "Apartments"
              ? "border-brand bg-brand"
              : "border-gray-300 bg-white"
              }`}
          >
            <Text
              className={`text-base font-semibold ${activeTab === "Apartments" ? "text-white" : "text-gray-700"
                }`}
            >
              Apartments
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content – grid on web, single column on mobile */}
        {/* Both lists are always rendered; the inactive one is hidden to preserve image cache */}
        <View style={activeTab !== "Roommates" ? { display: "none" } : undefined}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
            {displayRoommates.map((roommate) => (
              <View key={roommate.id} style={columns > 1 ? { width: cardWidth } : { width: "100%" }}>
                <RoommateCard
                  roommate={roommate}
                  onPress={() => router.push(`/roommate/${roommate.id}`)}
                />
              </View>
            ))}
          </View>
        </View>
        <View style={activeTab !== "Apartments" ? { display: "none" } : undefined}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
            {displayApartments.map((apartment) => (
              <View key={apartment.id} style={columns > 1 ? { width: cardWidth } : { width: "100%" }}>
                <ApartmentCard
                  apartment={apartment}
                  onPress={() => router.push(`/apartment/${apartment.id}`)}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}
