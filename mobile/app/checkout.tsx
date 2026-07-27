import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { useCart } from "@/hooks";
import { ordersApi } from "@/services/orders.api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { COLORS } from "@/constants/theme";

export default function CheckoutScreen() {
  const { cart, fetchCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    street: "",
    city: "",
    state: "",
    zip_code: "",
    country: "US",
    notes: "",
  });

  const handleCheckout = async () => {
    if (!form.street || !form.city || !form.state || !form.zip_code) {
      Alert.alert("Error", "Please fill in all shipping address fields");
      return;
    }
    setLoading(true);
    try {
      const order = await ordersApi.checkout({
        shipping_address: form,
        notes: form.notes,
      });
      fetchCart();
      Alert.alert("Order Placed!", `Order ${order.order_number} confirmed`, [
        { text: "OK", onPress: () => router.replace("/(tabs)/orders") },
      ]);
    } catch (error: any) {
      Alert.alert(
        "Checkout Failed",
        error?.response?.data?.detail || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-dark-500 text-base">Your cart is empty</Text>
        <Button
          title="Continue Shopping"
          onPress={() => router.back()}
          variant="outline"
          className="mt-4"
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-dark-900 text-lg font-bold mb-4">
          Shipping Address
        </Text>

        <Input
          label="Street Address *"
          placeholder="123 Main St"
          value={form.street}
          onChangeText={(v) => setForm({ ...form, street: v })}
        />

        <View className="flex-row gap-3">
          <View className="flex-1">
            <Input
              label="City *"
              placeholder="New York"
              value={form.city}
              onChangeText={(v) => setForm({ ...form, city: v })}
            />
          </View>
          <View className="flex-1">
            <Input
              label="State *"
              placeholder="NY"
              value={form.state}
              onChangeText={(v) => setForm({ ...form, state: v })}
            />
          </View>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1">
            <Input
              label="ZIP Code *"
              placeholder="10001"
              value={form.zip_code}
              onChangeText={(v) => setForm({ ...form, zip_code: v })}
              keyboardType="numeric"
            />
          </View>
          <View className="flex-1">
            <Input
              label="Country"
              placeholder="US"
              value={form.country}
              onChangeText={(v) => setForm({ ...form, country: v })}
            />
          </View>
        </View>

        <Input
          label="Order Notes (optional)"
          placeholder="Any special instructions..."
          value={form.notes}
          onChangeText={(v) => setForm({ ...form, notes: v })}
          multiline
          numberOfLines={3}
        />

        <View className="bg-dark-50 rounded-xl p-4 mt-2 mb-4">
          <Text className="text-dark-900 font-bold mb-3">Order Summary</Text>
          {cart.items.map((item) => (
            <View key={item.id} className="flex-row justify-between mb-2">
              <Text className="text-dark-600 text-sm flex-1" numberOfLines={1}>
                {item.product_name} x{item.quantity}
              </Text>
              <Text className="text-dark-900 text-sm ml-2">
                ${parseFloat(item.line_total).toFixed(2)}
              </Text>
            </View>
          ))}
          <View className="border-t border-dark-200 pt-2 mt-2">
            <View className="flex-row justify-between mb-1">
              <Text className="text-dark-500">Subtotal</Text>
              <Text className="text-dark-900">
                ${parseFloat(cart.subtotal).toFixed(2)}
              </Text>
            </View>
            {parseFloat(cart.discount) > 0 && (
              <View className="flex-row justify-between mb-1">
                <Text className="text-green-600">Discount</Text>
                <Text className="text-green-600">
                  -${parseFloat(cart.discount).toFixed(2)}
                </Text>
              </View>
            )}
            <View className="flex-row justify-between pt-2 border-t border-dark-200">
              <Text className="text-dark-900 font-bold text-lg">Total</Text>
              <Text className="text-primary-600 font-bold text-lg">
                ${parseFloat(cart.total).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        <Button
          title="Place Order"
          onPress={handleCheckout}
          loading={loading}
          fullWidth
          size="lg"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
