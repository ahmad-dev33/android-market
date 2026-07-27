import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "@/hooks";
import { COLORS } from "@/constants/theme";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: logout },
    ]);
  };

  const menuItems = [
    {
      icon: "receipt-outline" as const,
      title: "My Orders",
      onPress: () => router.push("/(tabs)/orders"),
    },
    {
      icon: "heart-outline" as const,
      title: "Wishlist",
      onPress: () => {},
    },
    {
      icon: "location-outline" as const,
      title: "Addresses",
      onPress: () => {},
    },
    {
      icon: "card-outline" as const,
      title: "Payment Methods",
      onPress: () => {},
    },
    {
      icon: "storefront-outline" as const,
      title: "Become a Vendor",
      onPress: () => router.push("/vendor/register"),
      badge: user?.role === "vendor" ? "Active" : undefined,
    },
    {
      icon: "notifications-outline" as const,
      title: "Notifications",
      onPress: () => {},
    },
    {
      icon: "help-circle-outline" as const,
      title: "Help & Support",
      onPress: () => {},
    },
    {
      icon: "settings-outline" as const,
      title: "Settings",
      onPress: () => {},
    },
  ];

  return (
    <ScrollView className="flex-1 bg-white pt-14">
      <View className="px-4 pb-6">
        <Text className="text-dark-900 text-2xl font-bold mb-6">Profile</Text>

        <View className="flex-row items-center bg-white rounded-2xl p-4 border border-dark-100 mb-6">
          <View className="w-16 h-16 bg-primary-100 rounded-full items-center justify-center mr-4">
            <Text className="text-primary-600 text-2xl font-bold">
              {user?.first_name?.[0] || user?.username?.[0] || "?"}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-dark-900 text-lg font-bold">
              {user?.first_name} {user?.last_name}
            </Text>
            <Text className="text-dark-500 text-sm">{user?.email}</Text>
            {user?.role === "vendor" && (
              <View className="flex-row items-center gap-1 mt-1">
                <Ionicons name="checkmark-circle" size={14} color={COLORS.primary} />
                <Text className="text-primary-600 text-xs font-medium">Vendor</Text>
              </View>
            )}
          </View>
          <Pressable
            onPress={() => router.push("/(auth)/login")}
            className="p-2"
          >
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </Pressable>
        </View>

        {menuItems.map((item, index) => (
          <Pressable
            key={index}
            onPress={item.onPress}
            className="flex-row items-center py-4 border-b border-dark-50"
          >
            <View className="w-10 h-10 bg-dark-50 rounded-full items-center justify-center mr-4">
              <Ionicons name={item.icon} size={20} color={COLORS.text} />
            </View>
            <Text className="flex-1 text-dark-900 font-medium">{item.title}</Text>
            {item.badge && (
              <View className="bg-primary-100 px-2 py-0.5 rounded-full mr-2">
                <Text className="text-primary-600 text-xs font-medium">
                  {item.badge}
                </Text>
              </View>
            )}
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </Pressable>
        ))}

        <Pressable
          onPress={handleLogout}
          className="flex-row items-center py-4 mt-2"
        >
          <View className="w-10 h-10 bg-red-50 rounded-full items-center justify-center mr-4">
            <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
          </View>
          <Text className="text-red-500 font-medium">Sign Out</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
