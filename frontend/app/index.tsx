import { useState, useEffect } from "react";
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
import { APARTMENTS, Apartment } from "../data/apartments";
import { ROOMMATES, Roommate } from "../data/roommates";
import { useResponsiveColumns } from "../hooks/useResponsiveColumns";
import ScreenLayout from "../components/ScreenLayout";
import "../global.css";

// Roommate data imported from ../data/roommates
// Apartment data imported from ../data/apartments

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
            source={roommate.image}
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
            source={apartment.image}
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

  const [roommatesCache, setRoommatesCache] = useState<Roommate[] | null>(null);
  const [apartmentsCache, setApartmentsCache] = useState<Apartment[] | null>(null);
  const [isFetchingRoommates, setIsFetchingRoommates] = useState(false);
  const [isFetchingApartments, setIsFetchingApartments] = useState(false);

  useEffect(() => {
    const fetchRoommates = async () => {
      setIsFetchingRoommates(true);
      try {
        const res = await fetch("http://192.168.0.197:5000/roommates");
        const data = await res.json();
        setRoommatesCache(data);
      } catch (err) {
        console.error("Failed to fetch roommates:", err);
      } finally {
        setIsFetchingRoommates(false);
      }
    };

    const fetchApartments = async () => {
      setIsFetchingApartments(true);
      try {
        const res = await fetch("http://192.168.0.197:5000/apartments");
        const data = await res.json();
        setApartmentsCache(data);
      } catch (err) {
        console.error("Failed to fetch apartments:", err);
      } finally {
        setIsFetchingApartments(false);
      }
    };

    if (activeTab === "Roommates" && roommatesCache === null && !isFetchingRoommates) {
      fetchRoommates();
    } else if (activeTab === "Apartments" && apartmentsCache === null && !isFetchingApartments) {
      fetchApartments();
    }
  }, [activeTab, roommatesCache, apartmentsCache, isFetchingRoommates, isFetchingApartments]);

  const displayRoommates = roommatesCache || ROOMMATES;
  const displayApartments = apartmentsCache || APARTMENTS;

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
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
          {activeTab === "Roommates"
            ? displayRoommates.map((roommate) => (
              <View key={roommate.id} style={columns > 1 ? { width: cardWidth } : { width: "100%" }}>
                <RoommateCard
                  roommate={roommate}
                  onPress={() => router.push(`/roommate/${roommate.id}`)}
                />
              </View>
            ))
            : displayApartments.map((apartment) => (
              <View key={apartment.id} style={columns > 1 ? { width: cardWidth } : { width: "100%" }}>
                <ApartmentCard
                  apartment={apartment}
                  onPress={() => router.push(`/apartment/${apartment.id}`)}
                />
              </View>
            ))}
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}
