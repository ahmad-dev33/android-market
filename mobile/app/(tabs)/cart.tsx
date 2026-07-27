import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "@/hooks";
import { cartApi } from "@/services/cart.api";
import { couponsApi } from "@/services/notifications.api";
import { CartItemCard } from "@/components/cart/CartItem";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/common/EmptyState";
import { COLORS } from "@/constants/theme";

export default function CartScreen() {
  const { cart, fetchCart } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (itemId: number, quantity: number) => {
    try {
      await cartApi.updateItem(itemId, quantity);
      fetchCart();
    } catch (error: any) {
      Alert.alert("Error", error?.response?.data?.detail || "Failed to update");
    }
  };

  const handleRemove = (itemId: number) => {
    Alert.alert("Remove Item", "Remove this item from your cart?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          try {
            await cartApi.removeItem(itemId);
            fetchCart();
          } catch {}
        },
      },
    ]);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    try {
      const result = await couponsApi.apply(couponCode.toUpperCase());
      Alert.alert("Success", `Coupon applied! Discount: $${result.discount}`);
      setCouponCode("");
      fetchCart();
    } catch (error: any) {
      Alert.alert(
        "Invalid Coupon",
        error?.response?.data?.detail || "Could not apply coupon"
      );
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = async () => {
    await couponsApi.remove();
    fetchCart();
  };

  if (!cart || cart.items.length === 0) {
    return (
      <View className="flex-1 bg-white pt-14">
        <EmptyState
          icon="cart-outline"
          title="Your cart is empty"
          subtitle="Add some products to get started"
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white pt-14">
      <View className="px-4 pb-3 border-b border-dark-100">
        <Text className="text-dark-900 text-2xl font-bold">
          Cart ({cart.total_items})
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-3">
        {cart.items.map((item) => (
          <CartItemCard
            key={item.id}
            item={item}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemove}
          />
        ))}

        <View className="flex-row gap-2 mb-4">
          <View className="flex-1">
            <Input
              placeholder="Coupon code"
              value={couponCode}
              onChangeText={setCouponCode}
              autoCapitalize="characters"
            />
          </View>
          <View className="justify-center">
            <Button
              title="Apply"
              onPress={handleApplyCoupon}
              loading={applyingCoupon}
              variant="secondary"
            />
          </View>
        </View>

        {cart.coupon && (
          <View className="flex-row items-center justify-between bg-green-50 p-3 rounded-xl mb-4">
            <View className="flex-row items-center gap-2">
              <Ionicons name="pricetag" size={16} color={COLORS.success} />
              <Text className="text-green-700 font-medium">Coupon Applied</Text>
            </View>
            <Button
              title="Remove"
              onPress={handleRemoveCoupon}
              variant="ghost"
              size="sm"
            />
          </View>
        )}
      </ScrollView>

      <View className="px-4 py-4 border-t border-dark-100 bg-white">
        <View className="flex-row justify-between mb-2">
          <Text className="text-dark-500">Subtotal</Text>
          <Text className="text-dark-900">${parseFloat(cart.subtotal).toFixed(2)}</Text>
        </View>
        {parseFloat(cart.discount) > 0 && (
          <View className="flex-row justify-between mb-2">
            <Text className="text-green-600">Discount</Text>
            <Text className="text-green-600">
              -${parseFloat(cart.discount).toFixed(2)}
            </Text>
          </View>
        )}
        <View className="flex-row justify-between mb-4 pt-2 border-t border-dark-100">
          <Text className="text-dark-900 font-bold text-lg">Total</Text>
          <Text className="text-primary-600 font-bold text-lg">
            ${parseFloat(cart.total).toFixed(2)}
          </Text>
        </View>
        <Button
          title="Proceed to Checkout"
          onPress={() => router.push("/checkout")}
          fullWidth
          size="lg"
          icon={
            <Ionicons name="lock-closed" size={18} color="white" />
          }
        />
      </View>
    </View>
  );
}
