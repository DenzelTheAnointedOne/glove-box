import React from "react";
import { Text, View } from "react-native";
import { PHASES } from "../data";
import { Body, Card, CheckRow, Heading, Title } from "../components";
import { useAppState } from "../state";
import { fonts, useColors } from "../theme";

export default function ChecklistScreen() {
  const { state, update } = useAppState();
  const { c } = useColors();

  const toggle = (id: string) => update((s) => ({ done: { ...s.done, [id]: !s.done[id] } }));

  return (
    <View style={{ gap: 18 }}>
      <View style={{ gap: 4 }}>
        <Title>Move-out checklist</Title>
        <Body small muted>Grouped by when to do it. Items marked safety matter most.</Body>
      </View>

      {PHASES.map((p) => {
        const done = p.items.filter((i) => state.done[i.id]).length;
        const all = done === p.items.length;
        return (
          <Card key={p.id} style={{ gap: 2 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 6 }}>
              <Heading>{p.name}</Heading>
              <View style={{ backgroundColor: all ? c.goodSoft : c.accentSoft, borderRadius: 99, paddingHorizontal: 8, paddingVertical: 2 }}>
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12, color: all ? c.good : c.ink, fontVariant: ["tabular-nums"] }}>
                  {done}/{p.items.length}
                </Text>
              </View>
            </View>
            {p.items.map((i, idx) => (
              <CheckRow key={i.id} first={idx === 0} title={i.title} detail={i.why} safety={i.safety} checked={!!state.done[i.id]} onToggle={() => toggle(i.id)} />
            ))}
          </Card>
        );
      })}
    </View>
  );
}
