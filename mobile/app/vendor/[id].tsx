import { useEffect, useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { vendorApi } from "@/services/vendor.api";
import { productsApi } from "@/services/products.api";
import { ProductCard } from "@/components/product/ProductCard";
import { LoadingScreen } from "@/components/common/EmptyState";
import { COLORS } from "@/constants/theme";
import type { Vendor, Product } from "@/types";

export default function VendorStoreScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      vendorApi.detail(id as string).catch(() => null),
      productsApi.list({ vendor: id }),
    ])
      .then(([v, p]) => {
        if (v) setVendor(v);
        setProducts(p.results || []);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingScreen />;

  if (!vendor) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-dark-500">Store not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {vendor.banner ? (
        <Image
          source={{ uri: vendor.banner }}
          className="w-full h-40"
          resizeMode="cover"
        />
      ) : (
        <View className="w-full h-40 bg-primary-100" />
      )}

      <View className="px-4 -mt-10">
        <View className="flex-row items-end gap-3 mb-4">
          {vendor.logo ? (
            <Image
              source={{ uri: vendor.logo }}
              className="w-20 h-20 rounded-2xl border-4 border-white"
            />
          ) : (
            <View className="w-20 h-20 bg-primary-600 rounded-2xl border-4 border-white items-center justify-center">
              <Text className="text-white text-2xl font-bold">
                {vendor.store_name[0]}
              </Text>
            </View>
          )}
          <View className="flex-1 pb-1">
            <View className="flex-row items-center gap-1">
              <Text className="text-dark-900 text-xl font-bold">
                {vendor.store_name}
              </Text>
              {vendor.is_verified && (
                <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />
              )}
            </View>
            <View className="flex-row items-center gap-1 mt-0.5">
              <Ionicons name="star" size={14} color={COLORS.star} />
              <Text className="text-dark-600 text-sm">
                {parseFloat(vendor.rating_avg).toFixed(1)} | {vendor.total_sales} sales
              </Text>
            </View>
          </View>
        </View>

        {vendor.description && (
          <Text className="text-dark-600 text-sm mb-4">{vendor.description}</Text>
        )}

        <View className="flex-row gap-4 mb-4">
          <View className="flex-1 bg-dark-50 rounded-xl p-3 items-center">
            <Text className="text-dark-900 font-bold text-lg">
              {vendor.total_products}
            </Text>
            <Text className="text-dark-500 text-xs">Products</Text>
          </View>
          <View className="flex-1 bg-dark-50 rounded-xl p-3 items-center">
            <Text className="text-dark-900 font-bold text-lg">
              {vendor.total_sales}
            </Text>
            <Text className="text-dark-500 text-xs">Sales</Text>
          </View>
          <View className="flex-1 bg-dark-50 rounded-xl p-3 items-center">
            <Text className="text-dark-900 font-bold text-lg">
              {parseFloat(vendor.rating_avg).toFixed(1)}
            </Text>
            <Text className="text-dark-500 text-xs">Rating</Text>
          </View>
        </View>
      </View>

      <View className="px-4">
        <Text className="text-dark-900 font-bold text-base mb-3">
          Products ({products.length})
        </Text>
        <FlatList
          data={products}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          scrollEnabled={false}
          renderItem={({ item }) => <ProductCard product={item} />}
        />
      </View>
    </View>
  );
}
