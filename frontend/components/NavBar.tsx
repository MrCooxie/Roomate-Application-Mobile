import { View, TouchableOpacity, Text, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import "../global.css";

type NavRoute = "home" | "chat" | "settings";

type Props = {
  activeRoute: NavRoute;
};

const NAV_ITEMS: { route: NavRoute; icon: string; href: string }[] = [
  { route: "home", icon: "home", href: "/" },
  { route: "chat", icon: "chatbubble", href: "/chat" },
  { route: "settings", icon: "settings-sharp", href: "/settings" },
];

export default function NavBar({ activeRoute }: Props) {
  const router = useRouter();

  if (Platform.OS === "web") {
    return (
      <View
        style={{
          position: "fixed" as any,
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: 56,
          backgroundColor: "#ffffff",
          borderBottomWidth: 1,
          borderBottomColor: "#e5e7eb",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 24,
        }}
      >
        <TouchableOpacity onPress={() => router.push("/" as any)}>
          <Text style={{ fontSize: 22, fontWeight: "bold", fontStyle: "italic", color: "#111827" }}>
            Roomy.
          </Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", gap: 24 }}>
          {NAV_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.route}
              onPress={() => router.push(item.href as any)}
              style={{ alignItems: "center" }}
            >
              <Ionicons
                name={item.icon as any}
                size={24}
                color={activeRoute === item.route ? "#111827" : "#9ca3af"}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-around border-t border-gray-200 bg-white pb-6 pt-3">
      {NAV_ITEMS.map((item) => (
        <TouchableOpacity
          key={item.route}
          className="items-center"
          onPress={() => router.push(item.href as any)}
        >
          <Ionicons
            name={item.icon as any}
            size={26}
            color={activeRoute === item.route ? "#111827" : "#9ca3af"}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}
