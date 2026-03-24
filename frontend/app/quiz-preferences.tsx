import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
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

export default function QuizPreferences() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const toggle = (option: string) => {
    setSelected((prev) => ({ ...prev, [option]: !prev[option] }));
  };

  const handleNext = () => {
    router.push("/quiz-apartment" as any);
  };

  const filtered = CATEGORIES.map((cat) => ({
    ...cat,
    options: cat.options.filter((opt) =>
      opt.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.options.length > 0);

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-8"
        contentContainerStyle={{ paddingTop: 60, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text className="mb-5 text-lg font-semibold text-gray-900">
          Select things about yourself
        </Text>

        {/* Search */}
        <View className="mb-6 rounded-full bg-emerald-100/60 px-5 py-3">
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
                  trackColor={{ false: "#d1d5db", true: "#6ee7b7" }}
                  thumbColor="#fff"
                />
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      {/* Bottom buttons */}
      <View className="flex-row gap-3 px-8 pb-10 pt-3">
        <TouchableOpacity
          className="flex-1 items-center rounded-full border border-gray-300 bg-gray-100 py-4"
          onPress={() => router.back()}
        >
          <Text className="text-base font-semibold text-gray-700">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 items-center rounded-full bg-emerald-300/80 py-4"
          onPress={handleNext}
        >
          <Text className="text-base font-semibold text-white">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
