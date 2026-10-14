import { useColorScheme } from "react-native";

// Night-lot slate with a sodium-lamp amber accent, same palette as the web prototype.
const light = {
  bg: "#eef0f3",
  surface: "#ffffff",
  ink: "#18202b",
  muted: "#5b6574",
  line: "#d6dbe2",
  accent: "#d9871f",
  accentInk: "#1c1406",
  accentSoft: "#fbecd6",
  good: "#2f7d5b",
  goodSoft: "#dff0e7",
  warn: "#b5481f",
  warnSoft: "#fbe3d9",
};

const dark: typeof light = {
  bg: "#10151c",
  surface: "#19212b",
  ink: "#e7ebf0",
  muted: "#97a2b1",
  line: "#2b3644",
  accent: "#f0a23b",
  accentInk: "#1c1406",
  accentSoft: "#3a2a12",
  good: "#5fc396",
  goodSoft: "#163428",
  warn: "#f08a62",
  warnSoft: "#3d2118",
};

export type Colors = typeof light;

export const fonts = {
  display: "Archivo_800ExtraBold",
  displayBold: "Archivo_700Bold",
  body: "AtkinsonHyperlegible_400Regular",
  bodyBold: "AtkinsonHyperlegible_700Bold",
};

export function useColors(): { c: Colors; isDark: boolean } {
  const isDark = useColorScheme() === "dark";
  return { c: isDark ? dark : light, isDark };
}
