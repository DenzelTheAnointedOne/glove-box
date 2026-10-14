import React, { useState } from "react";
import { Linking, Pressable, Text, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import { HOTLINES } from "../data";
import { Body, Button, Card, Label, Title } from "../components";
import { useAppState } from "../state";
import { fonts, useColors } from "../theme";

function SmallButton({ label, onPress }: { label: string; onPress: () => void }) {
  const { c } = useColors();
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => ({ borderWidth: 1, borderColor: c.line, backgroundColor: c.bg, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12, opacity: pressed ? 0.7 : 1 })}>
      <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14, color: c.ink }}>{label}</Text>
    </Pressable>
  );
}

export default function HelpScreen({ toast }: { toast: (m: string) => void }) {
  const { reset } = useAppState();
  const { c } = useColors();
  const [confirm, setConfirm] = useState(false);

  const open = (url: string, fallback: string) =>
    Linking.openURL(url).catch(async () => {
      await Clipboard.setStringAsync(fallback);
      toast(`Couldn't open your phone app. Copied ${fallback}.`);
    });

  return (
    <View style={{ gap: 18 }}>
      <View style={{ gap: 4 }}>
        <Title>Help lines</Title>
        <Body small muted>Free and confidential.</Body>
      </View>

      <Card style={{ gap: 0 }}>
        {HOTLINES.map((h, i) => (
          <View key={h.dial} style={{ paddingVertical: 12, gap: 6, borderTopWidth: i ? 1 : 0, borderTopColor: c.line }}>
            <Text selectable style={{ fontFamily: fonts.display, fontSize: 22, color: c.ink, fontVariant: ["tabular-nums"] }}>{h.number}</Text>
            <Body small muted>{h.desc}</Body>
            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
              <SmallButton label="Call" onPress={() => open(`tel:${h.dial}`, h.number)} />
              {h.sms && <SmallButton label="Text" onPress={() => open(`sms:${h.dial}`, h.number)} />}
              <SmallButton
                label="Copy"
                onPress={async () => {
                  await Clipboard.setStringAsync(h.number);
                  toast(`Copied ${h.number}`);
                }}
              />
            </View>
          </View>
        ))}
      </Card>

      <Card>
        <Label>Worth looking into</Label>
        <Body small><Text style={{ fontFamily: fonts.bodyBold }}>Rapid rehousing and rental assistance. </Text>Ask 211 whether you qualify. Some programs can help before you leave your home.</Body>
        <Body small>
          <Text style={{ fontFamily: fonts.bodyBold }}>SNAP and Lifeline phone service. </Text>You can usually apply without a fixed address.{" "}
          <Text style={{ color: c.accent, textDecorationLine: "underline" }} onPress={() => Linking.openURL("https://www.benefits.gov")}>benefits.gov</Text>
        </Body>
        <Body small><Text style={{ fontFamily: fonts.bodyBold }}>Libraries. </Text>Free wifi, charging, restrooms and a quiet place to work during the day.</Body>
      </Card>

      <Card>
        <Label>Your data</Label>
        <Body small muted>Everything you enter stays on this phone only.</Body>
        {confirm ? (
          <View style={{ gap: 8 }}>
            <Body small bold>Clear everything? This can't be undone.</Body>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <SmallButton label="Yes, clear it" onPress={() => { reset(); setConfirm(false); toast("Your data is cleared"); }} />
              <SmallButton label="Cancel" onPress={() => setConfirm(false)} />
            </View>
          </View>
        ) : (
          <Button ghost label="Clear my data" onPress={() => setConfirm(true)} />
        )}
      </Card>
    </View>
  );
}
