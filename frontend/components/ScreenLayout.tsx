import { View, Platform } from "react-native";
import NavBar from "./NavBar";
import "../global.css";

type Props = {
  children: React.ReactNode;
  activeRoute: "home" | "chat" | "settings";
};

export default function ScreenLayout({ children, activeRoute }: Props) {
  const isWeb = Platform.OS === "web";

  return (
    <View className="flex-1 bg-white">
      {isWeb && <NavBar activeRoute={activeRoute} />}
      <View
        className="flex-1"
        style={isWeb ? { paddingTop: 56 } : undefined}
      >
        <View className="mx-auto w-full flex-1 md:max-w-3xl lg:max-w-5xl xl:max-w-6xl">
          {children}
        </View>
      </View>
      {!isWeb && <NavBar activeRoute={activeRoute} />}
    </View>
  );
}
