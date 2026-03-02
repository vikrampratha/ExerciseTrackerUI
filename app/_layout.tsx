import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Stack } from "expo-router";

function RootNavigator() {
  const { token, loading } = useAuth();

  if (loading) return null; // todo: replace with splash/loading

  const isSignedIn = !!token;
  
  return (
    <Stack screenOptions={{ headerShown: false }}>

      <Stack.Protected guard = {!isSignedIn}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard = {isSignedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>

    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
