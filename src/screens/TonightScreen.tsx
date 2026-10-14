import React from "react";
import { View } from "react-native";
import { NIGHT_ROUTINE, SPOT_TIPS } from "../data";
import { Bar, Body, Button, Card, CheckRow, Label, Tip, Title } from "../components";
import { todayISO, useAppState } from "../state";

export default function TonightScreen() {
  const { state, update } = useAppState();

  // Covers the case where the app stays open past midnight.
  const night = state.nightDay === todayISO() ? state.night : {};
  const done = NIGHT_ROUTINE.filter((_, i) => night[i]).length;

  const toggle = (i: number) =>
    update((s) => {
      const base = s.nightDay === todayISO() ? s.night : {};
      return { night: { ...base, [i]: !base[i] }, nightDay: todayISO() };
    });

  const dateLabel = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <View style={{ gap: 18 }}>
      <View style={{ gap: 4 }}>
        <Title>Tonight's routine</Title>
        <Body small muted>{dateLabel}. Resets each day.</Body>
      </View>

      <Card>
        <Bar value={done / NIGHT_ROUTINE.length} />
        <View>
          {NIGHT_ROUTINE.map((t, i) => (
            <CheckRow key={i} first={i === 0} title={t} checked={!!night[i]} onToggle={() => toggle(i)} />
          ))}
        </View>
        <Button ghost label="Start a new night" onPress={() => update({ night: {}, nightDay: todayISO() })} />
      </Card>

      <Card>
        <Label>Choosing a spot</Label>
        <View style={{ gap: 8 }}>
          {SPOT_TIPS.map((t, i) => <Tip key={i} text={t.text} warn={t.warn} />)}
        </View>
      </Card>
    </View>
  );
}
