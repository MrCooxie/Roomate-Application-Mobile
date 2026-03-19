import { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CONVERSATIONS, Message } from "../../data/messages";
import "../../global.css";

// ─── Chat bubble ─────────────────────────────────────────────────────

function ChatBubble({ message }: { message: Message }) {
  return (
    <View
      className={`mb-3 max-w-[75%] rounded-3xl px-5 py-3 ${
        message.fromMe
          ? "self-end bg-gray-200"
          : "self-start bg-gray-200"
      }`}
    >
      <Text className="text-base text-gray-800">{message.text}</Text>
    </View>
  );
}

// ─── Conversation detail screen ──────────────────────────────────────

export default function ConversationDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [inputText, setInputText] = useState("");

  const conversation = CONVERSATIONS.find((c) => c.id === id);

  if (!conversation) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500">Conversation not found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View className="items-center border-b border-gray-100 pb-4 pt-14">
        {/* Back button */}
        <TouchableOpacity
          className="absolute left-5 top-14"
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={28} color="#111827" />
        </TouchableOpacity>

        {/* Avatar */}
        <Image
          source={conversation.avatar}
          className="mb-2 h-16 w-16 rounded-full"
          style={{ resizeMode: "cover" }}
        />

        {/* Name */}
        <Text className="text-lg font-bold text-black">
          {conversation.name}
        </Text>
      </View>

      {/* Messages */}
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 10 }}
        showsVerticalScrollIndicator={false}
      >
        {conversation.messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
      </ScrollView>

      {/* Input bar */}
      <View className="flex-row items-center border-t border-gray-200 px-4 pb-8 pt-3">
        <TextInput
          className="mr-3 flex-1 rounded-full bg-gray-100 px-5 py-3 text-base"
          placeholder="Message..."
          placeholderTextColor="#9ca3af"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity>
          <Ionicons name="send" size={24} color="#34d399" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
