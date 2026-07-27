import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAppStore } from "@/store";
import { LoadingScreen } from "@/components/common/EmptyState";
import { useEffect } from "react";

const queryClient = new QueryClient();

export default function RootLayout() {
  const { isLoading, loadUser } = useAppStore();

  useEffect(() => {
    loadUser();
  }, []);

  if (isLoading) return <LoadingScreen />;

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="product/[id]"
          options={{
            headerShown: true,
            title: "Product Details",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="checkout"
          options={{
            headerShown: true,
            title: "Checkout",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="vendor/[id]"
          options={{
            headerShown: true,
            title: "Store",
            headerBackTitle: "Back",
          }}
        />
      </Stack>
    </QueryClientProvider>
  );
}
