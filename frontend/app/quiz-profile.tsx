import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useQuiz } from "../context/quiz";
import "../global.css";

const Wrapper = Platform.OS === "web" ? View : KeyboardAvoidingView;

export default function QuizProfile() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [school, setSchool] = useState("");
  const [city, setCity] = useState("");
  const [introduction, setIntroduction] = useState("");
  const router = useRouter();
  const { setProfile } = useQuiz();

  const handleNext = () => {
    setProfile({ name, age, school, city, introduction });
    router.push("/quiz-preferences" as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Wrapper
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingTop: 60, paddingBottom: 40, alignItems: "center" }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ width: "100%", maxWidth: 430, paddingHorizontal: 32 }}>
          {/* Name */}
          <Text className="mb-2 text-base font-semibold text-gray-900">
            Name
          </Text>
          <View className="mb-5 rounded-full border border-gray-300 px-5 py-3.5">
            <TextInput
              placeholder="John Doe"
              placeholderTextColor="#9ca3af"
              value={name}
              onChangeText={setName}
              className="text-base text-gray-900"
            />
          </View>

          {/* Age */}
          <Text className="mb-2 text-base font-semibold text-gray-900">
            Age
          </Text>
          <View className="mb-5 rounded-full border border-gray-300 px-5 py-3.5">
            <TextInput
              placeholder="18"
              placeholderTextColor="#9ca3af"
              value={age}
              onChangeText={setAge}
              keyboardType="number-pad"
              className="text-base text-gray-900"
            />
          </View>

          {/* School */}
          <View className="mb-2 flex-row items-center gap-2">
            <Text className="text-base font-semibold text-gray-900">
              School
            </Text>
            <Ionicons name="school" size={18} color="#111827" />
          </View>
          <View className="mb-5 rounded-full border border-gray-300 px-5 py-3.5">
            <TextInput
              placeholder="University Of Tartu"
              placeholderTextColor="#9ca3af"
              value={school}
              onChangeText={setSchool}
              className="text-base text-gray-900"
            />
          </View>

          {/* City */}
          <View className="mb-2 flex-row items-center gap-2">
            <Text className="text-base font-semibold text-gray-900">
              City
            </Text>
            <Ionicons name="business" size={18} color="#111827" />
          </View>
          <View className="mb-5 rounded-full border border-gray-300 px-5 py-3.5">
            <TextInput
              placeholder="Tartu"
              placeholderTextColor="#9ca3af"
              value={city}
              onChangeText={setCity}
              className="text-base text-gray-900"
            />
          </View>

          {/* Introduction */}
          <View className="mb-2 flex-row items-center gap-2">
            <Text className="text-base font-semibold text-gray-900">
              Introduction
            </Text>
            <Ionicons name="pencil" size={18} color="#111827" />
          </View>
          <View className="mb-6 rounded-3xl bg-brand-light/40 px-5 py-4">
            <TextInput
              placeholder="Tell us about yourself..."
              placeholderTextColor="#9ca3af"
              value={introduction}
              onChangeText={setIntroduction}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
              className="text-base text-gray-900"
              style={{ minHeight: 160, lineHeight: 24 }}
            />
          </View>
          </View>
        </ScrollView>

        {/* Next button */}
        <View className="items-center pb-10">
          <View style={{ width: "100%", maxWidth: 430, paddingHorizontal: 32 }}>
          <TouchableOpacity
            className="items-center rounded-full bg-brand py-4"
            onPress={handleNext}
          >
            <Text className="text-base font-semibold text-white">Next</Text>
          </TouchableOpacity>
          </View>
        </View>
      </Wrapper>
    </SafeAreaView>
  );
}
