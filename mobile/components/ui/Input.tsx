import { Pressable, Text, TextInput, View } from "react-native";
import { useState } from "react";

type InputProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  error?: string;
  editable?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export function Input({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  keyboardType = "default",
  autoCapitalize = "none",
  error,
  editable = true,
  leftIcon,
  rightIcon,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecureVisible, setIsSecureVisible] = useState(!secureTextEntry);

  const borderColor = error
    ? "border-red-400"
    : isFocused
    ? "border-primary-500"
    : "border-dark-200";

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-dark-700 font-medium text-sm mb-1.5">{label}</Text>
      )}
      <View
        className={`flex-row items-center bg-white border ${borderColor} rounded-xl px-4 ${
          multiline ? "py-3" : "h-12"
        }`}
      >
        {leftIcon && <View className="mr-3">{leftIcon}</View>}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          secureTextEntry={secureTextEntry && !isSecureVisible}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          className="flex-1 text-dark-900 text-base"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          textAlignVertical={multiline ? "top" : "center"}
        />
        {secureTextEntry && (
          <Pressable
            onPress={() => setIsSecureVisible(!isSecureVisible)}
            className="ml-2"
          >
            <Text className="text-dark-400 text-sm">
              {isSecureVisible ? "Hide" : "Show"}
            </Text>
          </Pressable>
        )}
        {rightIcon && <View className="ml-3">{rightIcon}</View>}
      </View>
      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
}
