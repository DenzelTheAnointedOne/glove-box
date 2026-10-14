import React from "react";
import { Text, TextInput, View } from "react-native";
import { CAR_LABELS, NOW_LABELS } from "../data";
import { Body, Card, Label, Title } from "../components";
import { useAppState } from "../state";
import { fonts, useColors } from "../theme";

const fmt = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
const sum = (o: Record<string, number>) => Object.values(o).reduce((a, b) => a + (Number(b) || 0), 0);

function CostRows<K extends string>({ labels, values, onChange }: { labels: Record<K, string>; values: Record<K, number>; onChange: (k: K, v: number) => void }) {
  const { c } = useColors();
  return (
    <View style={{ gap: 8 }}>
      {(Object.keys(labels) as K[]).map((k) => (
        <View key={k} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Body style={{ flex: 1 }}>{labels[k]}</Body>
          <TextInput
            value={String(values[k] ?? 0)}
            onChangeText={(t) => onChange(k, Number(t.replace(/[^0-9]/g, "")) || 0)}
            keyboardType="number-pad"
            accessibilityLabel={`${labels[k]} per month`}
            style={{ width: 110, textAlign: "right", fontFamily: fonts.body, fontSize: 16, color: c.ink, backgroundColor: c.bg, borderColor: c.line, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, fontVariant: ["tabular-nums"] }}
          />
        </View>
      ))}
    </View>
  );
}

export default function BudgetScreen() {
  const { state, update } = useAppState();
  const { c } = useColors();

  const now = sum(state.now);
  const car = sum(state.car);
  const diff = now - car;
  const goal = (state.now.rent || 0) * 2;
  const months = diff > 0 ? Math.ceil(goal / diff) : 0;

  return (
    <View style={{ gap: 18 }}>
      <View style={{ gap: 4 }}>
        <Title>Rent vs. car life</Title>
        <Body small muted>Monthly costs. Example figures are filled in. Replace them with yours.</Body>
      </View>

      <Card>
        <Label>Now: housing</Label>
        <CostRows labels={NOW_LABELS} values={state.now} onChange={(k, v) => update((s) => ({ now: { ...s.now, [k]: v } }))} />
      </Card>

      <Card>
        <Label>After: living in the car</Label>
        <CostRows labels={CAR_LABELS} values={state.car} onChange={(k, v) => update((s) => ({ car: { ...s.car, [k]: v } }))} />
      </Card>

      <Card>
        <View style={{ flexDirection: "row", gap: 10 }}>
          {[["Housing / mo", now], ["Car life / mo", car]].map(([l, v]) => (
            <View key={l as string} style={{ flex: 1, backgroundColor: c.bg, borderRadius: 10, padding: 12, gap: 2 }}>
              <Body small muted>{l as string}</Body>
              <Text style={{ fontFamily: fonts.display, fontSize: 24, color: c.ink, fontVariant: ["tabular-nums"] }}>{fmt(v as number)}</Text>
            </View>
          ))}
        </View>
        <View style={{ backgroundColor: diff > 0 ? c.goodSoft : c.warnSoft, borderRadius: 10, padding: 14 }}>
          <Body bold style={{ color: diff > 0 ? c.good : c.warn }}>
            {diff > 0 ? `You'd keep about ${fmt(diff)} a month.` : `Car life costs ${fmt(-diff)} more a month at these numbers.`}
          </Body>
        </View>
        {diff > 0 && goal > 0 && (
          <Body small muted>
            At that rate, a {fmt(goal)} move-in fund (deposit + first month) takes about {months} month{months > 1 ? "s" : ""}.
          </Body>
        )}
      </Card>
    </View>
  );
}
