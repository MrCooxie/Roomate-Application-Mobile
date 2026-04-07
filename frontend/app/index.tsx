import { useState, useMemo } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";

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
          <Text className="text-lg font-bold text-black">{apartment.priceValue}</Text>
          <Text className="text-sm text-gray-500">{apartment.priceLabel}</Text>
          <Text className="text-sm font-medium text-gray-700">
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

const TENANT_OPTIONS = [1, 2, 3, 4] as const;

function parsePriceValue(val: string | number): number {
  if (typeof val === "number") return val;
  return parseFloat(val.replace(/[^0-9.]/g, "")) || 0;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("Roommates");
  const router = useRouter();
  const { columns, cardWidth } = useResponsiveColumns();

  const { roommates: displayRoommates, apartments } = useData();

  // Derive price bounds from actual apartment data
  const { priceBoundsMin, priceBoundsMax } = useMemo(() => {
    if (apartments.length === 0) return { priceBoundsMin: 0, priceBoundsMax: 1000 };
    const prices = apartments.map((a) => parsePriceValue(a.priceValue));
    return { priceBoundsMin: Math.floor(Math.min(...prices)), priceBoundsMax: Math.ceil(Math.max(...prices)) };
  }, [apartments]);

  // Apartment filters
  const [filterVisible, setFilterVisible] = useState(false);
  const [priceMin, setPriceMin] = useState<number | null>(null);
  const [priceMax, setPriceMax] = useState<number | null>(null);
  const [tenantFilter, setTenantFilter] = useState<number | null>(null);

  const effectiveMin = priceMin ?? priceBoundsMin;
  const effectiveMax = priceMax ?? priceBoundsMax;

  // Temporary filter state while the modal is open
  const [tmpPriceMin, setTmpPriceMin] = useState(priceBoundsMin);
  const [tmpPriceMax, setTmpPriceMax] = useState(priceBoundsMax);
  const [tmpTenantFilter, setTmpTenantFilter] = useState<number | null>(null);

  const openFilter = () => {
    setTmpPriceMin(effectiveMin);
    setTmpPriceMax(effectiveMax);
    setTmpTenantFilter(tenantFilter);
    setFilterVisible(true);
  };

  const applyFilter = () => {
    setPriceMin(tmpPriceMin);
    setPriceMax(tmpPriceMax);
    setTenantFilter(tmpTenantFilter);
    setFilterVisible(false);
  };

  const resetFilter = () => {
    setTmpPriceMin(priceBoundsMin);
    setTmpPriceMax(priceBoundsMax);
    setTmpTenantFilter(null);
  };

  const hasActiveFilters = (priceMin !== null && priceMin > priceBoundsMin) || (priceMax !== null && priceMax < priceBoundsMax) || tenantFilter !== null;

  const displayApartments = useMemo(() => {
    return apartments.filter((a) => {
      const price = parsePriceValue(a.priceValue);
      if (price < effectiveMin || price > effectiveMax) return false;
      if (tenantFilter !== null && a.maxTenants < tenantFilter) return false;
      return true;
    });
  }, [apartments, effectiveMin, effectiveMax, tenantFilter]);

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

        {/* Filter button – only shown on Apartments tab */}
        {activeTab === "Apartments" && (
          <View className="mb-4 flex-row items-center gap-2">
            <TouchableOpacity
              onPress={openFilter}
              className={`flex-row items-center gap-2 rounded-full border px-4 py-2.5 ${
                hasActiveFilters ? "border-brand bg-brand-light/30" : "border-gray-300 bg-white"
              }`}
            >
              <Ionicons name="options-outline" size={18} color={hasActiveFilters ? "#8EC19D" : "#6b7280"} />
              <Text className={`text-sm font-medium ${hasActiveFilters ? "text-brand" : "text-gray-700"}`}>
                Filters{hasActiveFilters ? " (active)" : ""}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Filter modal */}
        <Modal visible={filterVisible} transparent animationType="fade">
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setFilterVisible(false)}
            className="flex-1 items-center justify-center bg-black/40"
          >
            <TouchableOpacity activeOpacity={1} onPress={() => {}}>
              <View style={{ width: Math.min(screenWidth - 40, 400) }} className="rounded-2xl bg-white px-6 py-5">
                {/* Header */}
                <View className="mb-4 flex-row items-center justify-between">
                  <Text className="text-lg font-bold text-gray-900">Filters</Text>
                  <TouchableOpacity onPress={() => setFilterVisible(false)}>
                    <Ionicons name="close" size={22} color="#6b7280" />
                  </TouchableOpacity>
                </View>

                {/* Min price slider */}
                <Text className="mb-1 text-sm font-semibold text-gray-800">Min price</Text>
                <View className="mb-1 flex-row items-center justify-between">
                  <Text className="text-xs text-gray-500">€{priceBoundsMin}</Text>
                  <Text className="text-sm font-medium text-gray-900">€{tmpPriceMin}</Text>
                  <Text className="text-xs text-gray-500">€{priceBoundsMax}</Text>
                </View>
                <Slider
                  minimumValue={priceBoundsMin}
                  maximumValue={priceBoundsMax}
                  step={10}
                  value={tmpPriceMin}
                  onValueChange={(v) => setTmpPriceMin(Math.min(Math.round(v), tmpPriceMax - 10))}
                  minimumTrackTintColor="#8EC19D"
                  maximumTrackTintColor="#e5e7eb"
                  thumbTintColor="#8EC19D"
                  style={{ height: 40, marginBottom: 4 }}
                />

                {/* Max price slider */}
                <Text className="mb-1 text-sm font-semibold text-gray-800">Max price</Text>
                <View className="mb-1 flex-row items-center justify-between">
                  <Text className="text-xs text-gray-500">€{priceBoundsMin}</Text>
                  <Text className="text-sm font-medium text-gray-900">€{tmpPriceMax}</Text>
                  <Text className="text-xs text-gray-500">€{priceBoundsMax}</Text>
                </View>
                <Slider
                  minimumValue={priceBoundsMin}
                  maximumValue={priceBoundsMax}
                  step={10}
                  value={tmpPriceMax}
                  onValueChange={(v) => setTmpPriceMax(Math.max(Math.round(v), tmpPriceMin + 10))}
                  minimumTrackTintColor="#8EC19D"
                  maximumTrackTintColor="#e5e7eb"
                  thumbTintColor="#8EC19D"
                  style={{ height: 40, marginBottom: 8 }}
                />

                {/* Tenant count */}
                <Text className="mb-3 text-sm font-semibold text-gray-800">Tenants</Text>
                <View className="mb-5 flex-row flex-wrap gap-2">
                  {TENANT_OPTIONS.map((n) => (
                    <TouchableOpacity
                      key={n}
                      onPress={() => setTmpTenantFilter(tmpTenantFilter === n ? null : n)}
                      className={`rounded-full border px-4 py-2 ${
                        tmpTenantFilter === n
                          ? "border-brand bg-brand"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          tmpTenantFilter === n ? "text-white" : "text-gray-700"
                        }`}
                      >
                        {n === 4 ? "4+" : String(n)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    onPress={() => setTmpTenantFilter(null)}
                    className={`rounded-full border px-4 py-2 ${
                      tmpTenantFilter === null
                        ? "border-brand bg-brand"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        tmpTenantFilter === null ? "text-white" : "text-gray-700"
                      }`}
                    >
                      Any
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Action buttons */}
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={resetFilter}
                    className="flex-1 items-center rounded-full border border-gray-300 bg-gray-100 py-3"
                  >
                    <Text className="text-sm font-semibold text-gray-700">Reset</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={applyFilter}
                    className="flex-1 items-center rounded-full bg-brand py-3"
                  >
                    <Text className="text-sm font-semibold text-white">Apply</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

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
