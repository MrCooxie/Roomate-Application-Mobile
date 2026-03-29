import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQuiz } from "../context/quiz";
import "../global.css";

type Category = {
  title: string;
  options: string[];
};

const CATEGORIES: Category[] = [
  {
    title: "Hobbies",
    options: [
      "Walking",
      "Cooking",
      "Gaming",
      "Reading",
      "Sports",
      "Music",
      "Photography",
      "Partying",
      "Traveling",
      "Art",
    ],
  },
  {
    title: "Sleep schedule",
    options: ["Early bird", "Night owl", "Normal sleep schedule"],
  },
  {
    title: "Cleanliness",
    options: ["Very tidy", "Moderate", "Relaxed"],
  },
  {
    title: "Lifestyle",
    options: ["Smoker", "Drinking", "Vegan / Vegetarian", "Pet owner", "Busy schedule"],
  },
  {
    title: "Personality",
    options: ["Introverted", "Extroverted", "Responsible", "Outgoing", "Independent", "Easy-going"],
  },
  {
    title: "Study / Work",
    options: ["Studies from home", "Works from home", "Needs quiet space"],
  },
  {
    title: "Guest policy",
    options: ["Guests often", "Guests occasionally", "Prefer no guests"],
  },
];

const MAX_CUSTOM = 3;

export default function QuizPreferences() {
  const router = useRouter();
  const { setPreferences } = useQuiz();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [customInterests, setCustomInterests] = useState<string[]>([]);

  const toggle = (option: string) => {
    setSelected((prev) => ({ ...prev, [option]: !prev[option] }));
  };

  const addCustomInterest = (value?: string) => {
    const trimmed = (value ?? search).trim();
    if (!trimmed || customInterests.length >= MAX_CUSTOM) return;
    if (customInterests.includes(trimmed)) return;
    setCustomInterests((prev) => [...prev, trimmed]);
    setSearch("");
  };

  const removeCustomInterest = (interest: string) => {
    setCustomInterests((prev) => prev.filter((i) => i !== interest));
  };

  const handleNext = () => {
    const toggled = Object.keys(selected).filter((key) => selected[key]);
    setPreferences([...toggled, ...customInterests]);
    router.push("/quiz-apartment" as any);
  };

  const filtered = CATEGORIES.map((cat) => ({
    ...cat,
    options: cat.options.filter((opt) =>
      opt.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.options.length > 0);

  const allOptions = CATEGORIES.flatMap((cat) => cat.options);
  const searchTrimmed = search.trim();
  const hasNoResults = searchTrimmed.length > 0 && filtered.length === 0;
  const isExistingOption = allOptions.some(
    (opt) => opt.toLowerCase() === searchTrimmed.toLowerCase()
  );
  const isDuplicate = customInterests.some(
    (i) => i.toLowerCase() === searchTrimmed.toLowerCase()
  );
  const canAddCustom =
    hasNoResults &&
    !isExistingOption &&
    !isDuplicate &&
    customInterests.length < MAX_CUSTOM;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20, alignItems: "center" }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: "100%", maxWidth: 430, paddingHorizontal: 32 }}>
        {/* Title */}
        <Text className="mb-5 text-lg font-semibold text-gray-900">
          Select things about yourself
        </Text>

        {/* Search */}
        <View className="mb-1 rounded-full bg-brand-light/40 px-5 py-3">
          <TextInput
            placeholder="Search or add your own interest..."
            placeholderTextColor="#9ca3af"
            value={search}
            onChangeText={setSearch}
            className="text-base text-gray-900"
          />
        </View>
        <Text className="mb-3 px-2 text-xs text-gray-400">
          Can't find what you're looking for? Type it and add it as a custom interest (up to {MAX_CUSTOM})
        </Text>

        {/* Custom interest tags */}
        {customInterests.length > 0 && (
          <View className="mb-3 flex-row flex-wrap gap-2">
            {customInterests.map((interest) => (
              <TouchableOpacity
                key={interest}
                onPress={() => removeCustomInterest(interest)}
                className="flex-row items-center gap-1.5 rounded-full border border-brand bg-brand-light/30 px-4 py-2"
              >
                <Text className="text-sm text-gray-900">{interest}</Text>
                <Text className="text-sm font-bold text-gray-500">✕</Text>
              </TouchableOpacity>
            ))}
            <Text className="self-center text-xs text-gray-400">
              {MAX_CUSTOM - customInterests.length}/{MAX_CUSTOM} remaining
            </Text>
          </View>
        )}

        {/* No results — offer to add as custom */}
        {canAddCustom && (
          <TouchableOpacity
            className="mb-4 flex-row items-center justify-center gap-2 rounded-full border border-dashed border-brand py-3"
            onPress={() => addCustomInterest()}
          >
            <Text className="text-base text-brand">+</Text>
            <Text className="text-base text-gray-700">
              Add "{searchTrimmed}" as custom interest
            </Text>
          </TouchableOpacity>
        )}

        {hasNoResults && !canAddCustom && customInterests.length >= MAX_CUSTOM && (
          <Text className="mb-4 text-center text-sm text-gray-400">
            No results found. Custom interest limit reached.
          </Text>
        )}

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
    </SafeAreaView>
  );
}
