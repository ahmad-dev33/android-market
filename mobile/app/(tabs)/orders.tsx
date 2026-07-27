import { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ordersApi } from "@/services/orders.api";
import { EmptyState, LoadingScreen } from "@/components/common/EmptyState";
import { COLORS } from "@/constants/theme";
import type { Order } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  pending: COLORS.warning,
  processing: COLORS.primary,
  shipped: "#3b82f6",
  delivered: COLORS.success,
  cancelled: COLORS.error,
  refunded: COLORS.textMuted,
};

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersApi
      .list()
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingScreen />;

  if (orders.length === 0) {
    return (
      <View className="flex-1 bg-white pt-14">
        <EmptyState
          icon="receipt-outline"
          title="No orders yet"
          subtitle="Your order history will appear here"
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white pt-14">
      <View className="px-4 pb-3">
        <Text className="text-dark-900 text-2xl font-bold">My Orders</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/order/${item.id}`)}
            className="bg-white rounded-xl p-4 mb-3 border border-dark-100"
          >
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-dark-900 font-semibold">
                {item.order_number}
              </Text>
              <View
                className="px-2.5 py-1 rounded-full"
                style={{ backgroundColor: STATUS_COLORS[item.status] + "20" }}
              >
                <Text
                  className="text-xs font-medium capitalize"
                  style={{ color: STATUS_COLORS[item.status] }}
                >
                  {item.status}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-dark-500 text-sm">
                {new Date(item.created_at).toLocaleDateString()}
              </Text>
              <Text className="text-dark-900 font-bold">
                ${parseFloat(item.total).toFixed(2)}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}
