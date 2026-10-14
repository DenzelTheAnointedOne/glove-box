import React, { useCallback, useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { Ionicons } from "@expo/vector-icons";
import { useFonts, Archivo_700Bold, Archivo_800ExtraBold } from "@expo-google-fonts/archivo";
import { AtkinsonHyperlegible_400Regular, AtkinsonHyperlegible_700Bold } from "@expo-google-fonts/atkinson-hyperlegible";

import { StateProvider, useAppState } from "./src/state";
import { fonts, useColors } from "./src/theme";
import PlanScreen from "./src/screens/PlanScreen";
import ChecklistScreen from "./src/screens/ChecklistScreen";
import BudgetScreen from "./src/screens/BudgetScreen";
import TonightScreen from "./src/screens/TonightScreen";
import HelpScreen from "./src/screens/HelpScreen";

SplashScreen.preventAutoHideAsync().catch(() => {});

type Tab = "plan" | "check" | "budget" | "night" | "help";
const TABS: { key: Tab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: "plan", label: "Plan", icon: "pulse" },
  { key: "check", label: "Checklist", icon: "checkbox-outline" },
  { key: "budget", label: "Budget", icon: "cash-outline" },
  { key: "night", label: "Tonight", icon: "moon-outline" },
  { key: "help", label: "Help", icon: "call-outline" },
];

function Shell() {
  const { c, isDark } = useColors();
  const { ready } = useAppState();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>("plan");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  const [fontsLoaded] = useFonts({ Archivo_700Bold, Archivo_800ExtraBold, AtkinsonHyperlegible_400Regular, AtkinsonHyperlegible_700Bold });

  useEffect(() => {
    if (fontsLoaded && ready) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded, ready]);

  const go = useCallback((t: Tab) => {
    setTab(t);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, []);

  const toast = useCallback((m: string) => {
    setToastMsg(m);
    setTimeout(() => setToastMsg(null), 1800);
  }, []);

  if (!fontsLoaded || !ready) return null;

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: c.bg }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <View style={{ flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: c.line }}>
        <Text style={{ fontFamily: fonts.display, fontSize: 22, color: c.ink, letterSpacing: -0.4 }}>
          Glove<Text style={{ color: c.accent }}>box</Text>
        </Text>
        <Text style={{ fontFamily: fonts.body, fontSize: 13, color: c.muted }}>Living in your car, planned</Text>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView ref={scrollRef} contentContainerStyle={{ padding: 16, paddingBottom: 32 }} keyboardShouldPersistTaps="handled">
          {tab === "plan" && <PlanScreen goChecklist={() => go("check")} />}
          {tab === "check" && <ChecklistScreen />}
          {tab === "budget" && <BudgetScreen />}
          {tab === "night" && <TonightScreen />}
          {tab === "help" && <HelpScreen toast={toast} />}
        </ScrollView>
      </KeyboardAvoidingView>

      {toastMsg && (
        <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, bottom: 80 + insets.bottom, alignItems: "center" }}>
          <View style={{ backgroundColor: c.ink, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14 }}>
            <Text style={{ fontFamily: fonts.body, color: c.bg, fontSize: 14 }}>{toastMsg}</Text>
          </View>
        </View>
      )}

      <View accessibilityRole="tablist" style={{ flexDirection: "row", backgroundColor: c.surface, borderTopWidth: 1, borderTopColor: c.line, paddingTop: 6, paddingBottom: 6 + insets.bottom, paddingHorizontal: 4 }}>
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <Pressable key={t.key} onPress={() => go(t.key)} accessibilityRole="tab" accessibilityState={{ selected: active }} style={{ flex: 1, alignItems: "center", gap: 2, paddingVertical: 6 }}>
              <Ionicons name={t.icon} size={22} color={active ? c.accent : c.muted} />
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11, color: active ? c.accent : c.muted }}>{t.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StateProvider>
        <Shell />
      </StateProvider>
    </SafeAreaProvider>
  );
}
