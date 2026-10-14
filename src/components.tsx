import React from "react";
import { Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, fonts, useColors } from "./theme";

export function useStyles<T extends StyleSheet.NamedStyles<T>>(make: (c: Colors) => T): T {
  const { c } = useColors();
  return React.useMemo(() => StyleSheet.create(make(c)), [c]);
}

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const s = useStyles(cardStyles);
  return <View style={[s.card, style]}>{children}</View>;
}
const cardStyles = (c: Colors) => ({
  card: { backgroundColor: c.surface, borderColor: c.line, borderWidth: 1, borderRadius: 12, padding: 16, gap: 10 } as ViewStyle,
});

export function Title({ children }: { children: React.ReactNode }) {
  const { c } = useColors();
  return <Text style={{ fontFamily: fonts.display, fontSize: 26, lineHeight: 30, color: c.ink }}>{children}</Text>;
}

export function Heading({ children }: { children: React.ReactNode }) {
  const { c } = useColors();
  return <Text style={{ fontFamily: fonts.displayBold, fontSize: 18, color: c.ink }}>{children}</Text>;
}

export function Label({ children }: { children: React.ReactNode }) {
  const { c } = useColors();
  return (
    <Text style={{ fontFamily: fonts.displayBold, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", color: c.muted }}>
      {children}
    </Text>
  );
}

export function Body({ children, muted, small, bold, style }: { children: React.ReactNode; muted?: boolean; small?: boolean; bold?: boolean; style?: TextStyle }) {
  const { c } = useColors();
  return (
    <Text
      style={[
        { fontFamily: bold ? fonts.bodyBold : fonts.body, fontSize: small ? 14 : 16, lineHeight: small ? 20 : 23, color: muted ? c.muted : c.ink },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

export function Bar({ value }: { value: number }) {
  const { c } = useColors();
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <View style={{ height: 8, backgroundColor: c.line, borderRadius: 99, overflow: "hidden" }} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(pct) }}>
      <View style={{ width: `${pct}%`, height: "100%", backgroundColor: c.accent, borderRadius: 99 }} />
    </View>
  );
}

export function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const { c } = useColors();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={{
        borderWidth: 1,
        borderColor: selected ? c.accent : c.line,
        backgroundColor: selected ? c.accent : c.bg,
        borderRadius: 999,
        paddingVertical: 8,
        paddingHorizontal: 14,
      }}
    >
      <Text style={{ fontFamily: selected ? fonts.bodyBold : fonts.body, color: selected ? c.accentInk : c.ink, fontSize: 15 }}>{label}</Text>
    </Pressable>
  );
}

export function Button({ label, onPress, ghost }: { label: string; onPress: () => void; ghost?: boolean }) {
  const { c } = useColors();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => ({
        backgroundColor: ghost ? "transparent" : c.accent,
        borderWidth: ghost ? 1 : 0,
        borderColor: c.line,
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: "center",
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Text style={{ fontFamily: fonts.displayBold, fontSize: 16, color: ghost ? c.ink : c.accentInk }}>{label}</Text>
    </Pressable>
  );
}

export function CheckRow({ title, detail, checked, safety, onToggle, first }: { title: string; detail?: string; checked: boolean; safety?: boolean; onToggle: () => void; first?: boolean }) {
  const { c } = useColors();
  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      style={{ flexDirection: "row", gap: 12, paddingVertical: 10, borderTopWidth: first ? 0 : 1, borderTopColor: c.line }}
    >
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 6,
          borderWidth: 2,
          borderColor: checked ? c.accent : c.muted,
          backgroundColor: checked ? c.accent : "transparent",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 1,
        }}
      >
        {checked && <Ionicons name="checkmark" size={16} color={c.accentInk} />}
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ fontFamily: fonts.bodyBold, fontSize: 16, color: checked ? c.muted : c.ink, textDecorationLine: checked ? "line-through" : "none" }}>
          {title}
          {safety ? <Text style={{ color: c.warn, fontSize: 11, letterSpacing: 0.8 }}>{"  SAFETY"}</Text> : null}
        </Text>
        {detail ? <Body small muted>{detail}</Body> : null}
      </View>
    </Pressable>
  );
}

export function Tip({ text, warn }: { text: string; warn?: boolean }) {
  const { c } = useColors();
  return (
    <View
      style={{
        borderLeftWidth: 3,
        borderLeftColor: warn ? c.warn : c.accent,
        backgroundColor: warn ? c.warnSoft : c.accentSoft,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 14,
      }}
    >
      <Body small>{text}</Body>
    </View>
  );
}
