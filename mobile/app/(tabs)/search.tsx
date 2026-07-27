import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { productsApi } from "@/services/products.api";
import { ProductCard } from "@/components/product/ProductCard";
import { EmptyState } from "@/components/common/EmptyState";
import { COLORS } from "@/constants/theme";
import type { Product } from "@/types";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setProducts([]);
      setHasSearched(false);
      return;
    }
    setLoading(true);
    try {
      const results = await productsApi.search(q);
      setProducts(results);
      setHasSearched(true);
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      search(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <View className="flex-1 bg-white">
      <View className="px-4 pt-14 pb-3 bg-white border-b border-dark-100">
        <View className="flex-row items-center bg-dark-50 rounded-xl px-4 h-12">
          <Ionicons name="search" size={20} color={COLORS.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search products..."
            placeholderTextColor={COLORS.textMuted}
            className="flex-1 ml-3 text-dark-900 text-base"
            autoFocus
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={20} color={COLORS.textMuted} />
            </Pressable>
          )}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ marginTop: 40 }}
        />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ paddingHorizontal: 12, justifyContent: "space-between" }}
          contentContainerStyle={{ paddingVertical: 12 }}
          ListEmptyComponent={
            hasSearched ? (
              <EmptyState
                icon="search-outline"
                title="No products found"
                subtitle="Try a different search term"
              />
            ) : (
              <EmptyState
                icon="search-outline"
                title="Search for products"
                subtitle="Find exactly what you're looking for"
              />
            )
          }
          renderItem={({ item }) => <ProductCard product={item} />}
        />
      )}
    </View>
  );
}
