import { Image, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";

type CartItemProps = {
  item: {
    id: number;
    product_name: string;
    product_image: string | null;
    quantity: number;
    unit_price: string;
    line_total: string;
  };
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onRemove: (itemId: number) => void;
};

export function CartItemCard({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <View className="flex-row bg-white rounded-xl p-3 mb-3 border border-dark-100">
      <Image
        source={{ uri: item.product_image || "https://via.placeholder.com/80" }}
        className="w-20 h-20 rounded-lg"
        resizeMode="cover"
      />
      <View className="flex-1 ml-3 justify-between">
        <View>
          <Text className="text-dark-900 font-semibold text-sm" numberOfLines={2}>
            {item.product_name}
          </Text>
          <Text className="text-primary-600 font-bold text-base mt-1">
            ${parseFloat(item.unit_price).toFixed(2)}
          </Text>
        </View>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center bg-dark-50 rounded-lg">
            <Pressable
              onPress={() =>
                item.quantity > 1
                  ? onUpdateQuantity(item.id, item.quantity - 1)
                  : onRemove(item.id)
              }
              className="px-3 py-1.5"
            >
              <Ionicons
                name={item.quantity <= 1 ? "trash-outline" : "remove"}
                size={16}
                color={item.quantity <= 1 ? COLORS.error : COLORS.text}
              />
            </Pressable>
            <Text className="text-dark-900 font-semibold px-3">{item.quantity}</Text>
            <Pressable
              onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="px-3 py-1.5"
            >
              <Ionicons name="add" size={16} color={COLORS.primary} />
            </Pressable>
          </View>
          <Text className="text-dark-900 font-bold">
            ${parseFloat(item.line_total).toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
}
