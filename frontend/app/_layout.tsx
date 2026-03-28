import { Stack, Redirect } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "../context/auth";
import { DataProvider } from "../context/data";

function AppStack() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="quiz-intro" />
          <Stack.Screen name="quiz-profile" />
          <Stack.Screen name="quiz-preferences" />
          <Stack.Screen name="quiz-apartment" />
        </Stack>
        <Redirect href="/login" />
      </>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <Redirect href="/" />
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <DataProvider>
          <AppStack />
        </DataProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

