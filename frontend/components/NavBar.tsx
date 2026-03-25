import { View, TouchableOpacity, Text, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import "../global.css";

type NavRoute = "home" | "chat" | "settings";

type Props = {
  activeRoute: NavRoute;
};

const NAV_ITEMS: { route: NavRoute; label: string; icon: string; iconOutline: string; href: string }[] = [
  { route: "home", label: "Home", icon: "home", iconOutline: "home-outline", href: "/" },
  { route: "chat", label: "Chat", icon: "chatbubble", iconOutline: "chatbubble-outline", href: "/chat" },
  { route: "settings", label: "Settings", icon: "settings-sharp", iconOutline: "settings-outline", href: "/settings" },
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
          height: 64,
          backgroundColor: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottomWidth: 1,
          borderBottomColor: "rgba(0,0,0,0.06)",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 32,
        } as any}
      >
        <TouchableOpacity onPress={() => router.push("/" as any)}>
          <Text style={{ fontSize: 24, fontWeight: "800", fontStyle: "italic", color: "#111827" }}>
            Roomy.
          </Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = activeRoute === item.route;
            return (
              <TouchableOpacity
                key={item.route}
                onPress={() => router.push(item.href as any)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 999,
                  backgroundColor: isActive ? "#f0faf3" : "transparent",
                } as any}
              >
                <Ionicons
                  name={(isActive ? item.icon : item.iconOutline) as any}
                  size={20}
                  color={isActive ? "#8EC19D" : "#6b7280"}
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: isActive ? "600" : "500",
                    color: isActive ? "#111827" : "#6b7280",
                  }}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  return (
    <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-around border-t border-gray-200 bg-white pb-6 pt-3">
      {NAV_ITEMS.map((item) => {
        const isActive = activeRoute === item.route;
        return (
          <TouchableOpacity
            key={item.route}
            className="items-center"
            onPress={() => router.push(item.href as any)}
          >
            <Ionicons
              name={(isActive ? item.icon : item.iconOutline) as any}
              size={26}
              color={isActive ? "#111827" : "#9ca3af"}
            />
            <Text
              style={{
                fontSize: 10,
                marginTop: 2,
                fontWeight: isActive ? "600" : "400",
                color: isActive ? "#111827" : "#9ca3af",
              }}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
