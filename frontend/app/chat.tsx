import { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CONVERSATIONS, Conversation } from "../data/messages";
import ScreenLayout from "../components/ScreenLayout";
import "../global.css";

// ─── Conversation row ────────────────────────────────────────────────

function ConversationRow({
  conversation,
  onPress,
}: {
  conversation: Conversation;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="mb-1">
      <View className="flex-row items-center py-3">
        {/* Avatar */}
        <Image
          source={conversation.avatar}
          style={{ width: 56, height: 56, borderRadius: 28, marginRight: 16 }}
          resizeMode="cover"
        />

        {/* Text content */}
        <View className="flex-1">
          <Text className="text-base font-bold text-black">
            {conversation.name}
          </Text>
          <Text className="text-sm text-gray-500" numberOfLines={1}>
            {conversation.lastMessage}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View className="ml-[72px] h-px bg-gray-200" />
    </TouchableOpacity>
  );
}

// ─── Match row ───────────────────────────────────────────────────────

function MatchRow({ conversation }: { conversation: Conversation }) {
  return (
    <View className="mb-1">
      <View className="flex-row items-center py-3">
        {/* Avatar */}
        <Image
          source={conversation.avatar}
          style={{ width: 56, height: 56, borderRadius: 28, marginRight: 16 }}
          resizeMode="cover"
        />

        {/* Name */}
        <View className="flex-1">
          <Text className="text-base font-bold text-black">
            {conversation.name}
          </Text>
        </View>

        {/* Checkmark */}
        <Ionicons name="checkmark" size={24} color="#9ca3af" />
      </View>

      {/* Divider */}
      <View className="ml-[72px] h-px bg-gray-200" />
    </View>
  );
}

// ─── Main Chat screen ────────────────────────────────────────────────

type Tab = "Messages" | "Matches";

export default function Chat() {
  const [activeTab, setActiveTab] = useState<Tab>("Messages");
  const router = useRouter();

  return (
    <ScreenLayout activeRoute="chat">
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text className="mb-5 text-center text-2xl font-bold text-black">
          {activeTab === "Messages" ? "Messages" : "Matches"}
        </Text>

        {/* Tabs */}
        <View className="mb-6 flex-row gap-3">
          <TouchableOpacity
            onPress={() => setActiveTab("Messages")}
            className={`flex-1 items-center rounded-full border py-3 ${
              activeTab === "Messages"
                ? "border-brand bg-brand"
                : "border-gray-300 bg-white"
            }`}
          >
            <Text
              className={`text-base font-semibold ${
                activeTab === "Messages" ? "text-white" : "text-gray-700"
              }`}
            >
              Messages
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("Matches")}
            className={`flex-1 items-center rounded-full border py-3 ${
              activeTab === "Matches"
                ? "border-brand bg-brand"
                : "border-gray-300 bg-white"
            }`}
          >
            <Text
              className={`text-base font-semibold ${
                activeTab === "Matches" ? "text-white" : "text-gray-700"
              }`}
            >
              Matches
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {activeTab === "Messages" ? (
          CONVERSATIONS.map((conversation) => (
            <ConversationRow
              key={conversation.id}
              conversation={conversation}
              onPress={() =>
                router.push(`/conversation/${conversation.id}` as any)
              }
            />
          ))
        ) : (
          CONVERSATIONS.map((conversation) => (
            <MatchRow
              key={conversation.id}
              conversation={conversation}
            />
          ))
        )}
      </ScrollView>
    </ScreenLayout>
  );
}
