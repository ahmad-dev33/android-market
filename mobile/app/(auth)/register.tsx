import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
  Alert,
  ScrollView,
} from "react-native";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/hooks";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { COLORS } from "@/constants/theme";

export default function RegisterScreen() {
  const { register } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !username || !password || !passwordConfirm) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    if (password !== passwordConfirm) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await register({
        email,
        username,
        password,
        password_confirm: passwordConfirm,
        first_name: firstName,
        last_name: lastName,
      });
      router.replace("/(tabs)");
    } catch (error: any) {
      const msg = error?.response?.data;
      const detail =
        typeof msg === "object"
          ? Object.values(msg).flat().join("\n")
          : "Registration failed";
      Alert.alert("Error", detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 px-6 pt-16">
          <View className="mb-8">
            <View className="w-16 h-16 bg-primary-600 rounded-2xl items-center justify-center mb-6">
              <Ionicons name="storefront" size={32} color="white" />
            </View>
            <Text className="text-dark-900 text-3xl font-bold">Create Account</Text>
            <Text className="text-dark-500 text-base mt-2">
              Join the marketplace today
            </Text>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <Input
                label="First Name"
                placeholder="John"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
            <View className="flex-1">
              <Input
                label="Last Name"
                placeholder="Doe"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>

          <Input
            label="Username *"
            placeholder="johndoe"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            leftIcon={
              <Ionicons name="person-outline" size={20} color={COLORS.textMuted} />
            }
          />

          <Input
            label="Email *"
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
            label="Password *"
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            leftIcon={
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={COLORS.textMuted}
              />
            }
          />

          <Input
            label="Confirm Password *"
            placeholder="Confirm your password"
            value={passwordConfirm}
            onChangeText={setPasswordConfirm}
            secureTextEntry
            leftIcon={
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={COLORS.textMuted}
              />
            }
          />

          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            fullWidth
            size="lg"
          />

          <View className="flex-row items-center justify-center mt-6 mb-8">
            <Text className="text-dark-500 text-sm">
              Already have an account?{" "}
            </Text>
            <Link href="/(auth)/login" asChild>
              <Pressable>
                <Text className="text-primary-600 text-sm font-semibold">
                  Sign In
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
