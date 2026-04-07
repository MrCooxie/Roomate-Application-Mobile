import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  ActivityIndicator,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../context/auth";
import { useQuiz } from "../context/quiz";
import "../global.css";

type Category = {
  title: string;
  options: string[];
};

const CATEGORIES: Category[] = [
  {
    title: "Pricing",
    options: ["Free", "Affordable", "Mid-range", "Expensive"],
  },
  {
    title: "Location",
    options: [
      "Central",
      "Near university",
      "Near public transport",
      "Quiet neighborhood",
      "Close to shops",
      "Ground floor",
      "High floor",
    ],
  },
  {
    title: "Look & Feel",
    options: ["Clean", "Spacious", "Bright", "Modern", "Cozy", "Minimalist", "Furnished"],
  },
  {
    title: "Size",
    options: ["Studio", "1 bedroom", "2 bedrooms", "3+ bedrooms"],
  },
  {
    title: "Amenities",
    options: [
      "Washing machine",
      "Dishwasher",
      "Balcony",
      "Parking",
      "Storage room",
      "Wi-Fi included",
      "Gym access",
    ],
  },
  {
    title: "Roommates",
    options: ["Living alone", "1 roommate", "2 roommates", "3+ roommates"],
  },
  {
    title: "Lease",
    options: ["Short-term", "Long-term", "Month-to-month", "Flexible"],
  },
  {
    title: "Rules",
    options: ["Pet-friendly", "Smoking allowed", "Guests allowed", "Quiet hours"],
  },
];

export default function QuizApartment() {
  const router = useRouter();
  const { login } = useAuth();
  const { data: quizData, setApartmentPreferences, submit } = useQuiz();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  const toggle = (option: string) => {
    setSelected((prev) => ({ ...prev, [option]: !prev[option] }));
  };

  const handleNext = async () => {
    if (loading) return;
    setLoading(true);
    setApartmentPreferences(Object.keys(selected).filter((key) => selected[key]));
    try {
      const result = await submit();
      if (result) {
        login({
          airtableId: result.airtableId,
          userId: result.userId,
          email: result.email,
          firstName: result.firstName,
          lastName: result.lastName,
        });
      }
    } catch (err) {
      console.error("Failed to submit quiz:", err);
    }
    router.replace("/" as any);
  };

  const filtered = CATEGORIES.map((cat) => ({
    ...cat,
    options: cat.options.filter((opt) =>
      opt.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.options.length > 0);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20, alignItems: "center" }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: "100%", maxWidth: 430, paddingHorizontal: 32 }}>
        {/* Title */}
        <Text className="mb-6 text-center text-2xl font-bold text-gray-900">
          Requirements
        </Text>

        {/* Subtitle */}
        <Text className="mb-4 text-base font-semibold text-gray-900">
          Select what you're looking for in a flat
        </Text>

        {/* Search */}
        <View className="mb-6 rounded-full bg-brand-light/40 px-5 py-3">
          <TextInput
            placeholder="Search"
            placeholderTextColor="#9ca3af"
            value={search}
            onChangeText={setSearch}
            className="text-base text-gray-900"
          />
        </View>

        {/* Categories */}
        {filtered.map((category) => (
          <View key={category.title} className="mb-6">
            <Text className="mb-3 text-xl font-bold text-gray-900">
              {category.title}
            </Text>
            {category.options.map((option) => (
              <View
                key={option}
                className="mb-2 flex-row items-center justify-between rounded-full border border-gray-300 px-5 py-3"
              >
                <Text className="text-base text-gray-900">{option}</Text>
                <Switch
                  value={!!selected[option]}
                  onValueChange={() => toggle(option)}
                  trackColor={{ false: "#d1d5db", true: "#8EC19D" }}
                  thumbColor="#fff"
                />
              </View>
            ))}
          </View>
        ))}
        </View>
      </ScrollView>

      {/* Bottom buttons */}
      <View className="items-center pb-10 pt-3">
        <View style={{ width: "100%", maxWidth: 430, paddingHorizontal: 32 }} className="flex-row gap-3">
        <TouchableOpacity
          className="flex-1 items-center rounded-full border border-gray-300 bg-gray-100 py-4"
          onPress={() => router.back()}
        >
          <Text className="text-base font-semibold text-gray-700">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 items-center rounded-full bg-brand py-4"
          onPress={handleNext}
        >
          <Text className="text-base font-semibold text-white">Next</Text>
        </TouchableOpacity>
        </View>
      </View>
      {/* Loading overlay */}
      <Modal visible={loading} transparent animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/40">
          <View className="items-center rounded-3xl bg-white px-10 py-8">
            <ActivityIndicator size="large" color="#8EC19D" />
            <Text className="mt-4 text-base font-semibold text-gray-900">
              Creating your account...
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
