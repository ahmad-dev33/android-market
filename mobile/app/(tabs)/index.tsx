import { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { productsApi } from "@/services/products.api";
import { ProductCard } from "@/components/product/ProductCard";
import { LoadingScreen } from "@/components/common/EmptyState";
import { COLORS, SPACING } from "@/constants/theme";
import type { Product, Category } from "@/types";

export default function HomeScreen() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [featuredData, categoriesData] = await Promise.all([
        productsApi.featured(),
        productsApi.categories(),
      ]);
      setFeatured(featuredData);
      setCategories(categoriesData);
    } catch {} finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) return <LoadingScreen />;

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ paddingBottom: 20 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="px-4 pt-14 pb-4 bg-primary-600">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-white/70 text-sm">Welcome back</Text>
            <Text className="text-white text-2xl font-bold">Android Market</Text>
          </View>
          <Pressable
            onPress={() => router.push("/(tabs)/search")}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
          >
            <Ionicons name="search" size={20} color="white" />
          </Pressable>
        </View>
      </View>

      <View className="px-4 mt-5">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-dark-900 text-lg font-bold">Categories</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((cat) => (
            <Pressable
              key={cat.id}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/search",
                  params: { category: cat.slug },
                })
              }
              className="items-center mr-5"
            >
              <View className="w-16 h-16 bg-primary-50 rounded-2xl items-center justify-center mb-1">
                <Ionicons
                  name={(cat.icon || "grid") as keyof typeof Ionicons.glyphMap}
                  size={24}
                  color={COLORS.primary}
                />
              </View>
              <Text className="text-dark-700 text-xs text-center w-16" numberOfLines={1}>
                {cat.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View className="px-4 mt-6">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-dark-900 text-lg font-bold">Featured Products</Text>
          <Pressable onPress={() => router.push("/(tabs)/search")}>
            <Text className="text-primary-600 text-sm font-medium">See All</Text>
          </Pressable>
        </View>
        <FlatList
          data={featured}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          scrollEnabled={false}
          renderItem={({ item }) => <ProductCard product={item} />}
        />
      </View>
    </ScrollView>
  );
}
