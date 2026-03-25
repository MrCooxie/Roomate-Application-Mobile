import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { APARTMENTS } from "../../data/apartments";
import "../../global.css";

const { width } = Dimensions.get("window");

export default function ApartmentDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const apartment = APARTMENTS.find((a) => a.id === id);

  if (!apartment) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-lg text-gray-500">Apartment not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: 50, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header – back button + address */}
        <View className="mb-5 flex-row items-center px-5">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="chevron-back" size={26} color="#111827" />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-lg font-bold text-black">
            {apartment.address}
          </Text>
          {/* Spacer to balance the back button */}
          <View style={{ width: 26 }} />
        </View>

        {/* Apartment image */}
        <View className="mx-5 mb-4 overflow-hidden rounded-2xl">
          <Image
            source={apartment.image}
            className="w-full rounded-2xl"
            style={{ height: width * 0.6, resizeMode: "cover" }}
          />
        </View>

        {/* Price */}
        <Text className="mb-4 text-center text-3xl font-bold text-black">
          {apartment.priceValue}
        </Text>

        {/* Property stats */}
        <View className="mx-5 mb-6 flex-row items-center justify-around">
          <View className="flex-row items-center gap-2">
            <Ionicons name="pricetag" size={18} color="#6b7280" />
            <Text className="text-sm text-gray-600">{apartment.sqft} sqft</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Ionicons name="bed" size={18} color="#6b7280" />
            <Text className="text-sm text-gray-600">{apartment.beds} Bed</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Ionicons name="water" size={18} color="#6b7280" />
            <Text className="text-sm text-gray-600">{apartment.baths} Bath</Text>
          </View>
        </View>

        {/* Owner actions */}
        <View className="mx-5 mb-6 flex-row items-center gap-3">
          <TouchableOpacity className="flex-row items-center gap-2 rounded-full border border-gray-300 px-4 py-2">
            <Image
              source={apartment.ownerAvatar}
              className="h-7 w-7 rounded-full"
            />
            <Text className="text-sm font-medium text-gray-800">
              Owner's Profile
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center gap-2 rounded-full bg-brand px-5 py-2.5">
            <Text className="text-sm font-semibold text-white">
              Message owner
            </Text>
            <Ionicons name="chatbubble" size={16} color="white" />
          </TouchableOpacity>
        </View>

        {/* Description card */}
        <View className="mx-5 mb-6 rounded-2xl border border-gray-200 p-5">
          <Text className="text-sm leading-6 text-gray-700">
            {apartment.description}
          </Text>
        </View>

        {/* Location section */}
        <View className="mx-5 mb-4 items-center">
          <View className="mb-3 flex-row items-center gap-1">
            <Ionicons name="location" size={18} color="#ef4444" />
            <Text className="text-base font-semibold text-black">Location</Text>
          </View>
          <View className="w-full overflow-hidden rounded-2xl">
            <Image
              source={apartment.mapImage}
              className="w-full rounded-2xl"
              style={{ height: 200, resizeMode: "cover" }}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
