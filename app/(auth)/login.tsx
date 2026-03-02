import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function LoginScreen() {
  const { signIn } = useAuth();

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSignIn = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    const res = await signIn(username.trim(), password);
    setSubmitting(false);

    if (!res.ok) {
      setError(res.message);
      return;
    }

    router.replace("/(tabs)");
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.kicker}>WELCOME BACK</Text>
          <Text style={styles.title}>Sign in</Text>
          <Text style={styles.sub}>For testing:  <Text style={styles.inlineCode}>admin/admin</Text>.</Text>
        </View>

        <View style={{ gap: 12 }}>
          <View style={styles.inputRow}>
            <Ionicons name="person-outline" size={18} color="#A1A1AA" />
            <TextInput
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              placeholder="Username"
              placeholderTextColor="#6B7280"
              style={styles.input}
            />
          </View>

          <View style={styles.inputRow}>
            <Ionicons name="lock-closed-outline" size={18} color="#A1A1AA" />
            <TextInput
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              secureTextEntry
              placeholder="Password"
              placeholderTextColor="#6B7280"
              style={styles.input}
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            onPress={onSignIn}
            disabled={submitting}
            style={({ pressed }) => [
              styles.loginBtn,
              submitting && styles.loginBtnDisabled,
              pressed && !submitting && styles.pressed,
            ]}
          >
            <Text style={styles.loginBtnText}>{submitting ? "Signing in…" : "Sign in"}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0B0B0D",
    paddingHorizontal: 16,
    justifyContent: "center",
  },

  card: {
    backgroundColor: "#121214",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  header: { gap: 8, marginBottom: 14 },

  kicker: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.2,
    color: "#A1A1AA",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  sub: {
    color: "#A1A1AA",
    fontWeight: "700",
    lineHeight: 18,
  },
  inlineCode: {
    color: "#E5E5EA",
    fontWeight: "900",
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontWeight: "800",
  },

  error: {
    color: "#FF453A",
    fontWeight: "800",
    marginTop: 4,
  },

  loginBtn: {
    marginTop: 6,
    backgroundColor: "#32D74B",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  loginBtnText: {
    color: "#000000",
    fontWeight: "900",
    fontSize: 15,
    letterSpacing: 0.2,
  },
  loginBtnDisabled: { opacity: 0.6 },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
});