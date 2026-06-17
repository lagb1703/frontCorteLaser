import type { CollapsibleItem } from "../interfaces";
export const variables: CollapsibleItem[] = [
  {
    title: "precio Material",
    symbol: "materialPrice",
  },
  {
    title: "precio Espesor",
    symbol: "thicknessPrice",
  },
  {
    title: "area",
    symbol: "area",
  },
  {
    title: "peso material",
    symbol: "weight",
  },
  {
    title: "perímetro",
    symbol: "perimeter",
  },
  {
    title: "cantidad",
    symbol: "amount",
  },
  {
    title: "speed",
    symbol: "speed",
  },
  {
    title: "number",
    symbol: "number",
  },
];

export const operations: CollapsibleItem[] = [
  { title: "Suma", symbol: "+", nridad: "*" },
  { title: "Resta", symbol: "-", nridad: "*" },
  { title: "Multiplicación", symbol: "*", nridad: "*" },
  { title: "División", symbol: "/", nridad: 2 },
  { title: "Potenciación", symbol: "**", nridad: 2 },
  { title: "modulo", symbol: "%", nridad: 2 },
  { title: "redondear", symbol: "round", nridad: 1 },
];
