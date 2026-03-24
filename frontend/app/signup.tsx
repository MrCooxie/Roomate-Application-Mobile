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
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import "../global.css";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#c3e8c1", "#dfffde", "#ffffff"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 32 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* App name */}
          <Text className="mb-12 text-center text-4xl font-bold italic text-gray-900">
            Roomy.
          </Text>

          {/* Sign up label */}
          <Text className="mb-4 text-center text-base font-semibold text-gray-900">
            Sign up
          </Text>

          {/* Email */}
          <View className="mb-3 rounded-full bg-white/70 px-5 py-3.5">
            <TextInput
              placeholder="Enter email"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              className="text-base text-gray-900"
            />
          </View>

          {/* Password */}
          <View className="mb-4 rounded-full bg-white/70 px-5 py-3.5">
            <TextInput
              placeholder="Enter password"
              placeholderTextColor="#9ca3af"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              className="text-base text-gray-900"
            />
          </View>

          {/* Forgot password */}
          <TouchableOpacity className="mb-6">
            <Text className="text-center text-sm text-gray-500">
              Forgot password?
            </Text>
          </TouchableOpacity>

          {/* Or divider */}
          <View className="mb-6 flex-row items-center">
            <View className="flex-1 border-b border-gray-300" />
            <Text className="mx-4 text-sm text-gray-500">Or</Text>
            <View className="flex-1 border-b border-gray-300" />
          </View>

          {/* Continue with Apple */}
          <TouchableOpacity className="mb-3 flex-row items-center rounded-full bg-white/70 px-5 py-3.5">
            <Ionicons name="logo-apple" size={22} color="#000" />
            <Text className="flex-1 text-center text-base font-medium text-gray-900">
              Continue with Apple
            </Text>
          </TouchableOpacity>

          {/* Continue with Google */}
          <TouchableOpacity className="mb-8 flex-row items-center rounded-full bg-white/70 px-5 py-3.5">
            <Text style={{ fontSize: 20 }}>G</Text>
            <Text className="flex-1 text-center text-base font-medium text-gray-900">
              Continue with Google
            </Text>
          </TouchableOpacity>

          {/* Get started button */}
          <TouchableOpacity
            className="mb-6 items-center rounded-full bg-emerald-300/80 py-4"
            onPress={() => router.push("/quiz-intro" as any)}
          >
            <Text className="text-base font-semibold text-white">Get started</Text>
          </TouchableOpacity>

          {/* Already have an account */}
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-center text-sm font-semibold text-gray-700">
              Already have an account?
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
