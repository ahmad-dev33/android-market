import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { productsApi } from "@/services/products.api";
import { useAuth, useCart } from "@/hooks";
import { reviewsApi } from "@/services/notifications.api";
import { Button } from "@/components/ui/Button";
import { LoadingScreen } from "@/components/common/EmptyState";
import { COLORS } from "@/constants/theme";
import type { Product, Review } from "@/types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;
    Promise.all([
      productsApi.detail(id),
      reviewsApi.productReviews(Number(id)).catch(() => []),
    ])
      .then(([p, r]) => {
        setProduct(p);
        setReviews(r);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      Alert.alert("Login Required", "Please login to add items to cart", [
        { text: "Login", onPress: () => {} },
      ]);
      return;
    }
    setAddingToCart(true);
    try {
      await addToCart(product!.id);
      Alert.alert("Added!", "Product added to your cart");
    } catch (error: any) {
      Alert.alert("Error", error?.response?.data?.detail || "Failed to add");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading || !product) return <LoadingScreen />;

  const images = product.images || [];
  const displayImages = images.length > 0
    ? images
    : [{ id: 0, image: "https://via.placeholder.com/400", alt_text: "" }];

  return (
    <ScrollView className="flex-1 bg-white">
      <View>
        <FlatList
          horizontal
          pagingEnabled
          data={displayImages}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            setSelectedImage(
              Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH)
            );
          }}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item.image }}
              style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH }}
              resizeMode="cover"
            />
          )}
        />
        {displayImages.length > 1 && (
          <View className="flex-row justify-center gap-1.5 mt-3">
            {displayImages.map((_, index) => (
              <View
                key={index}
                className={`h-1.5 rounded-full ${
                  index === selectedImage
                    ? "w-6 bg-primary-600"
                    : "w-1.5 bg-dark-300"
                }`}
              />
            ))}
          </View>
        )}
      </View>

      <View className="px-4 pt-4">
        <View className="flex-row items-start justify-between mb-2">
          <Text className="text-dark-900 text-xl font-bold flex-1 mr-4">
            {product.name}
          </Text>
          <Pressable className="p-2">
            <Ionicons name="heart-outline" size={24} color={COLORS.text} />
          </Pressable>
        </View>

        <View className="flex-row items-center gap-1 mb-3">
          <Ionicons name="star" size={16} color={COLORS.star} />
          <Text className="text-dark-700 font-medium">
            {parseFloat(product.rating_avg).toFixed(1)}
          </Text>
          <Text className="text-dark-400 text-sm">
            ({product.rating_count} reviews)
          </Text>
          <Text className="text-dark-300 mx-1">|</Text>
          <Text className="text-dark-400 text-sm">
            {product.sales_count} sold
          </Text>
        </View>

        <View className="flex-row items-baseline gap-2 mb-4">
          <Text className="text-primary-600 text-3xl font-bold">
            ${parseFloat(product.price).toFixed(2)}
          </Text>
          {product.compare_at_price && (
            <>
              <Text className="text-dark-400 line-through text-lg">
                ${parseFloat(product.compare_at_price).toFixed(2)}
              </Text>
              <View className="bg-green-100 px-2 py-0.5 rounded-full">
                <Text className="text-green-700 text-xs font-medium">
                  {Math.round(
                    ((parseFloat(product.compare_at_price) - parseFloat(product.price)) /
                      parseFloat(product.compare_at_price)) *
                      100
                  )}
                  % OFF
                </Text>
              </View>
            </>
          )}
        </View>

        <Pressable
          onPress={() => product.vendor_id && product.vendor_id > 0}
          className="flex-row items-center p-3 bg-dark-50 rounded-xl mb-4"
        >
          <View className="w-10 h-10 bg-primary-100 rounded-full items-center justify-center mr-3">
            <Ionicons name="storefront" size={18} color={COLORS.primary} />
          </View>
          <View className="flex-1">
            <Text className="text-dark-900 font-medium">{product.vendor_name}</Text>
            <Text className="text-dark-500 text-xs">Visit Store</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
        </Pressable>

        <View className="mb-4">
          <Text className="text-dark-900 font-bold text-base mb-2">Description</Text>
          <Text className="text-dark-600 leading-6">{product.description}</Text>
        </View>

        <View className="flex-row gap-3 mb-4">
          <View className="flex-1 bg-dark-50 rounded-xl p-3 items-center">
            <Ionicons name="cube-outline" size={20} color={COLORS.text} />
            <Text className="text-dark-900 text-xs mt-1">
              {product.is_in_stock ? `${product.stock} in stock` : "Out of stock"}
            </Text>
          </View>
          <View className="flex-1 bg-dark-50 rounded-xl p-3 items-center">
            <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.text} />
            <Text className="text-dark-900 text-xs mt-1">Secure checkout</Text>
          </View>
          <View className="flex-1 bg-dark-50 rounded-xl p-3 items-center">
            <Ionicons name="car-outline" size={20} color={COLORS.text} />
            <Text className="text-dark-900 text-xs mt-1">Free shipping</Text>
          </View>
        </View>

        {reviews.length > 0 && (
          <View className="mb-6">
            <Text className="text-dark-900 font-bold text-base mb-3">
              Reviews ({reviews.length})
            </Text>
            {reviews.slice(0, 5).map((review) => (
              <View
                key={review.id}
                className="bg-dark-50 rounded-xl p-3 mb-2"
              >
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-dark-900 font-medium text-sm">
                    {review.user_name}
                  </Text>
                  <View className="flex-row gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Ionicons
                        key={star}
                        name={star <= review.rating ? "star" : "star-outline"}
                        size={14}
                        color={COLORS.star}
                      />
                    ))}
                  </View>
                </View>
                {review.title && (
                  <Text className="text-dark-800 font-medium text-sm mb-1">
                    {review.title}
                  </Text>
                )}
                <Text className="text-dark-600 text-sm">{review.comment}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View className="px-4 py-4 border-t border-dark-100">
        <View className="flex-row gap-3">
          <Button
            title={product.is_in_stock ? "Add to Cart" : "Out of Stock"}
            onPress={handleAddToCart}
            loading={addingToCart}
            disabled={!product.is_in_stock}
            fullWidth
            size="lg"
            icon={<Ionicons name="cart" size={18} color="white" />}
          />
        </View>
      </View>
    </ScrollView>
  );
}
