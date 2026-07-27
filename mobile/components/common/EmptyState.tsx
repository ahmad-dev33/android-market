import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";

type EmptyStateProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
};

export function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-12">
      <View className="w-20 h-20 rounded-full bg-dark-50 items-center justify-center mb-4">
        <Ionicons name={icon} size={36} color={COLORS.textMuted} />
      </View>
      <Text className="text-dark-900 font-bold text-lg text-center">{title}</Text>
      {subtitle && (
        <Text className="text-dark-500 text-sm text-center mt-2">{subtitle}</Text>
      )}
    </View>
  );
}

export function LoadingScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <View className="w-12 h-12 rounded-full border-4 border-primary-200 border-t-primary-600" />
    </View>
  );
}
