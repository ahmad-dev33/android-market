import { useEffect, useState } from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ordersApi } from "@/services/orders.api";
import { LoadingScreen } from "@/components/common/EmptyState";
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

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      ordersApi
        .detail(Number(id))
        .then(setOrder)
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <LoadingScreen />;

  if (!order) {
    return (
      <View className="flex-1 bg-white items-center justify-center p-6 pt-14">
        <Ionicons name="alert-circle-outline" size={64} color={COLORS.error} />
        <Text className="text-dark-900 text-lg font-bold mt-4">Order Not Found</Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-6 px-6 py-3 bg-primary-600 rounded-xl"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white pt-14 px-4">
      <View className="flex-row items-center justify-between pb-4 border-b border-dark-100">
        <Pressable onPress={() => router.back()} className="p-1">
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </Pressable>
        <Text className="text-dark-900 text-lg font-bold">Order Details</Text>
        <View className="w-8" />
      </View>

      <View className="py-4 border-b border-dark-100">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-dark-900 font-bold text-xl">{order.order_number}</Text>
          <View
            className="px-3 py-1 rounded-full"
            style={{ backgroundColor: STATUS_COLORS[order.status] + "20" }}
          >
            <Text
              className="text-sm font-semibold capitalize"
              style={{ color: STATUS_COLORS[order.status] }}
            >
              {order.status}
            </Text>
          </View>
        </View>
        <Text className="text-dark-500 text-sm">
          Placed on {new Date(order.created_at).toLocaleString()}
        </Text>
      </View>

      {/* Items */}
      <View className="py-4 border-b border-dark-100">
        <Text className="text-dark-900 font-bold text-base mb-3">Items</Text>
        {order.items?.map((item) => (
          <View key={item.id} className="flex-row justify-between items-center mb-3">
            <View className="flex-1 pr-2">
              <Text className="text-dark-900 font-medium" numberOfLines={1}>
                {item.product_name}
              </Text>
              <Text className="text-dark-500 text-xs">
                Qty: {item.quantity} • ${parseFloat(item.unit_price).toFixed(2)}
              </Text>
            </View>
            <Text className="text-dark-900 font-semibold">
              ${parseFloat(item.total).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      {/* Shipping Address */}
      {order.shipping_address && (
        <View className="py-4 border-b border-dark-100">
          <Text className="text-dark-900 font-bold text-base mb-2">Shipping Address</Text>
          <Text className="text-dark-600 text-sm">
            {order.shipping_address.street || ""}
          </Text>
          <Text className="text-dark-600 text-sm">
            {order.shipping_address.city || ""}, {order.shipping_address.state || ""}{" "}
            {order.shipping_address.zip_code || ""}
          </Text>
          <Text className="text-dark-600 text-sm">
            {order.shipping_address.country || "US"}
          </Text>
        </View>
      )}

      {/* Summary */}
      <View className="py-4 mb-10">
        <Text className="text-dark-900 font-bold text-base mb-3">Summary</Text>
        <View className="flex-row justify-between mb-2">
          <Text className="text-dark-500 text-sm">Subtotal</Text>
          <Text className="text-dark-900 text-sm">
            ${parseFloat(order.subtotal).toFixed(2)}
          </Text>
        </View>
        {parseFloat(order.discount) > 0 && (
          <View className="flex-row justify-between mb-2">
            <Text className="text-green-600 text-sm">Discount</Text>
            <Text className="text-green-600 text-sm">
              -${parseFloat(order.discount).toFixed(2)}
            </Text>
          </View>
        )}
        <View className="flex-row justify-between mb-2">
          <Text className="text-dark-500 text-sm">Shipping</Text>
          <Text className="text-dark-900 text-sm">
            ${parseFloat(order.shipping_cost).toFixed(2)}
          </Text>
        </View>
        <View className="flex-row justify-between pt-3 border-t border-dark-100">
          <Text className="text-dark-900 font-bold text-lg">Total</Text>
          <Text className="text-primary-600 font-bold text-lg">
            ${parseFloat(order.total).toFixed(2)}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
