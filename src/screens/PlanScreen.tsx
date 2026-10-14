import React, { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";
import { ALL_ITEMS, Climate, Companion, tailoredTips, Vehicle } from "../data";
import { Bar, Body, Button, Card, CheckRow, Chip, Heading, Label, Tip } from "../components";
import { useAppState } from "../state";
import { fonts, useColors } from "../theme";

const VEHICLES: [Vehicle, string][] = [["sedan", "Sedan"], ["suv", "SUV / hatch"], ["van", "Minivan / van"], ["truck", "Pickup"]];
const WHO: [Companion, string][] = [["partner", "A partner"], ["kids", "Kids"], ["pet", "A pet"]];
const CLIMATES: [Climate, string][] = [["cold", "Cold"], ["mild", "Mild"], ["hot", "Hot"]];

function parseISO(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const d = new Date(+m[1], +m[2] - 1, +m[3]);
  return isNaN(d.getTime()) || d.getMonth() !== +m[2] - 1 ? null : d;
}
function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function PlanScreen({ goChecklist }: { goChecklist: () => void }) {
  const { state, update } = useAppState();
  const { c } = useColors();
  const [dateText, setDateText] = useState(state.moveDate);
  useEffect(() => setDateText(state.moveDate), [state.moveDate]);

  const move = parseISO(state.moveDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = move ? Math.round((move.getTime() - today.getTime()) / 864e5) : null;
  const daysLabel = days === null ? "pick a date" : days > 0 ? "days until move-out" : days === 0 ? "move-out is today" : "days since move-out";

  const doneCount = ALL_ITEMS.filter((i) => state.done[i.id]).length;
  const next = ALL_ITEMS.filter((i) => !state.done[i.id]).slice(0, 3);

  const shiftDate = (n: number) => {
    const base = move ?? new Date();
    const d = new Date(base);
    d.setDate(d.getDate() + n);
    update({ moveDate: toISO(d) });
  };

  const toggleWho = (w: Companion) =>
    update((s) => ({ who: s.who.includes(w) ? s.who.filter((x) => x !== w) : [...s.who, w] }));

  return (
    <View style={{ gap: 18 }}>
      <Card>
        <Heading>Tell us about your move</Heading>
        <Body small muted>This tailors your checklist and safety tips. It stays on this phone only.</Body>

        <Body bold small>Move-out date</Body>
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <TextInput
            value={dateText}
            onChangeText={(t) => {
              setDateText(t);
              if (parseISO(t)) update({ moveDate: t });
            }}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={c.muted}
            keyboardType="numbers-and-punctuation"
            accessibilityLabel="Move-out date"
            style={{ flex: 1, fontFamily: fonts.body, fontSize: 16, color: c.ink, backgroundColor: c.bg, borderColor: parseISO(dateText) ? c.line : c.warn, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 }}
          />
          <Chip label="−1 wk" selected={false} onPress={() => shiftDate(-7)} />
          <Chip label="+1 wk" selected={false} onPress={() => shiftDate(7)} />
        </View>
        {!parseISO(dateText) && <Body small style={{ color: c.warn }}>Enter the date as YYYY-MM-DD, for example 2026-11-03.</Body>}

        <Body bold small>Vehicle</Body>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {VEHICLES.map(([v, l]) => <Chip key={v} label={l} selected={state.vehicle === v} onPress={() => update({ vehicle: v })} />)}
        </View>

        <Body bold small>Who's coming</Body>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {WHO.map(([w, l]) => <Chip key={w} label={l} selected={state.who.includes(w)} onPress={() => toggleWho(w)} />)}
        </View>

        <Body bold small>Climate this season</Body>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {CLIMATES.map(([k, l]) => <Chip key={k} label={l} selected={state.climate === k} onPress={() => update({ climate: k })} />)}
        </View>
      </Card>

      <Card>
        <Label>Countdown</Label>
        <View style={{ flexDirection: "row", alignItems: "baseline", gap: 10 }}>
          <Text style={{ fontFamily: fonts.display, fontSize: 48, lineHeight: 52, color: c.accent, fontVariant: ["tabular-nums"] }}>
            {days === null ? "—" : Math.abs(days)}
          </Text>
          <Body muted>{daysLabel}</Body>
        </View>
        <Bar value={doneCount / ALL_ITEMS.length} />
        <Body small muted>{doneCount} of {ALL_ITEMS.length} checklist items done</Body>
      </Card>

      <Card>
        <Label>Do these next</Label>
        {next.length ? (
          next.map((i, idx) => (
            <CheckRow key={i.id} first={idx === 0} title={i.title} detail={i.why} safety={i.safety} checked={false} onToggle={() => update((s) => ({ done: { ...s.done, [i.id]: true } }))} />
          ))
        ) : (
          <Body muted>Every item is done. Check your nightly routine.</Body>
        )}
        <Button ghost label="See the full checklist" onPress={goChecklist} />
      </Card>

      <Card>
        <Label>For your situation</Label>
        <View style={{ gap: 8 }}>
          {tailoredTips(state).map((t, i) => <Tip key={i} text={t.text} warn={t.warn} />)}
        </View>
      </Card>
    </View>
  );
}
