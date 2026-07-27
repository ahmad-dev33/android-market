import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
  Alert,
} from "react-native";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/hooks";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { COLORS } from "@/constants/theme";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert(
        "Login Failed",
        error?.response?.data?.detail || "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <View className="flex-1 px-6 pt-16">
        <View className="mb-10">
          <View className="w-16 h-16 bg-primary-600 rounded-2xl items-center justify-center mb-6">
            <Ionicons name="storefront" size={32} color="white" />
          </View>
          <Text className="text-dark-900 text-3xl font-bold">Welcome Back</Text>
          <Text className="text-dark-500 text-base mt-2">
            Sign in to continue shopping
          </Text>
        </View>

        <Input
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon={
            <Ionicons name="mail-outline" size={20} color={COLORS.textMuted} />
          }
        />

        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          leftIcon={
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.textMuted} />
          }
        />

        <Pressable className="self-end mb-6">
          <Text className="text-primary-600 text-sm font-medium">
            Forgot Password?
          </Text>
        </Pressable>

        <Button
          title="Sign In"
          onPress={handleLogin}
          loading={loading}
          fullWidth
          size="lg"
        />

        <View className="flex-row items-center justify-center mt-6">
          <Text className="text-dark-500 text-sm">
            Don't have an account?{" "}
          </Text>
          <Link href="/(auth)/register" asChild>
            <Pressable>
              <Text className="text-primary-600 text-sm font-semibold">
                Sign Up
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
