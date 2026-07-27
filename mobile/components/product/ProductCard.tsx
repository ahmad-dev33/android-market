import { Image, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { COLORS, RADIUS } from "@/constants/theme";
import type { Product } from "@/types";

type ProductCardProps = {
  product: Product;
  horizontal?: boolean;
};

export function ProductCard({ product, horizontal = false }: ProductCardProps) {
  const imageUrl = product.primary_image?.image;

  if (horizontal) {
    return (
      <Pressable
        onPress={() => router.push(`/product/${product.id}`)}
        className="flex-row bg-white rounded-xl overflow-hidden mb-3 border border-dark-100"
      >
        <Image
          source={{ uri: imageUrl || "https://via.placeholder.com/120" }}
          className="w-28 h-28"
          resizeMode="cover"
        />
        <View className="flex-1 p-3 justify-between">
          <View>
            <Text className="text-dark-900 font-semibold text-sm" numberOfLines={2}>
              {product.name}
            </Text>
            <Text className="text-dark-500 text-xs mt-1">{product.vendor_name}</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-primary-600 font-bold text-base">
              ${parseFloat(product.price).toFixed(2)}
            </Text>
            {product.compare_at_price && (
              <Text className="text-dark-400 line-through text-xs">
                ${parseFloat(product.compare_at_price).toFixed(2)}
              </Text>
            )}
          </View>
          <View className="flex-row items-center gap-1">
            <Ionicons name="star" size={12} color={COLORS.star} />
            <Text className="text-dark-600 text-xs">
              {parseFloat(product.rating_avg).toFixed(1)} ({product.rating_count})
            </Text>
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={() => router.push(`/product/${product.id}`)}
      className="w-[48%] bg-white rounded-xl overflow-hidden border border-dark-100 mb-3"
    >
      <Image
        source={{ uri: imageUrl || "https://via.placeholder.com/200" }}
        className="w-full h-40"
        resizeMode="cover"
      />
      {!product.is_in_stock && (
        <View className="absolute top-2 left-2 bg-red-500 px-2 py-0.5 rounded-full">
          <Text className="text-white text-xs font-medium">Out of Stock</Text>
        </View>
      )}
      {product.compare_at_price && (
        <View className="absolute top-2 right-2 bg-green-500 px-2 py-0.5 rounded-full">
          <Text className="text-white text-xs font-medium">
            {Math.round(
              ((parseFloat(product.compare_at_price) - parseFloat(product.price)) /
                parseFloat(product.compare_at_price)) *
                100
            )}
            % OFF
          </Text>
        </View>
      )}
      <View className="p-3">
        <Text className="text-dark-900 font-semibold text-sm" numberOfLines={2}>
          {product.name}
        </Text>
        <Text className="text-dark-500 text-xs mt-1" numberOfLines={1}>
          {product.vendor_name}
        </Text>
        <View className="flex-row items-center gap-1 mt-1">
          <Ionicons name="star" size={12} color={COLORS.star} />
          <Text className="text-dark-600 text-xs">
            {parseFloat(product.rating_avg).toFixed(1)} ({product.rating_count})
          </Text>
        </View>
        <View className="flex-row items-center mt-2">
          <Text className="text-primary-600 font-bold text-base">
            ${parseFloat(product.price).toFixed(2)}
          </Text>
          {product.compare_at_price && (
            <Text className="text-dark-400 line-through text-xs ml-2">
              ${parseFloat(product.compare_at_price).toFixed(2)}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}
