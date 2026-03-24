import { Stack, Redirect } from "expo-router";
import { AuthProvider, useAuth } from "../context/auth";

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

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppStack />
    </AuthProvider>
  );
}

