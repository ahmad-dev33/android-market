import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { COLORS, RADIUS, SPACING } from "@/constants/theme";

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
};

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
}: ButtonProps) {
  const baseStyle = "flex-row items-center justify-center rounded-xl";

  const sizeStyle = {
    sm: "px-4 py-2",
    md: "px-6 py-3.5",
    lg: "px-8 py-4",
  }[size];

  const variantStyle = {
    primary: "bg-primary-600",
    secondary: "bg-dark-100",
    outline: "border border-dark-200 bg-white",
    ghost: "bg-transparent",
    danger: "bg-red-500",
  }[variant];

  const textStyle = {
    primary: "text-white font-semibold",
    secondary: "text-dark-900 font-semibold",
    outline: "text-dark-900 font-semibold",
    ghost: "text-primary-600 font-semibold",
    danger: "text-white font-semibold",
  }[variant];

  const sizeText = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  }[size];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`${baseStyle} ${sizeStyle} ${variantStyle} ${
        disabled ? "opacity-50" : ""
      } ${fullWidth ? "w-full" : ""}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "white" : COLORS.primary} />
      ) : (
        <View className="flex-row items-center gap-2">
          {icon}
          <Text className={`${textStyle} ${sizeText}`}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
}
