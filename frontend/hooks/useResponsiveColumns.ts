import { useWindowDimensions, Platform } from "react-native";

export function useResponsiveColumns(gap: number = 16) {
  const { width } = useWindowDimensions();

  if (Platform.OS !== "web") {
    return { columns: 1, cardWidth: width };
  }

  // Constrain to max content width (matches ScreenLayout xl:max-w-6xl = 1152px)
  const containerWidth = Math.min(width, 1152);
  let columns = 1;

  if (containerWidth >= 1024) {
    columns = 3;
  } else if (containerWidth >= 768) {
    columns = 2;
  }

  const totalGap = gap * (columns - 1);
  const cardWidth = (containerWidth - totalGap - 40) / columns; // 40 = horizontal padding

  return { columns, cardWidth };
}
