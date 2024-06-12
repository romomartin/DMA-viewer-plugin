export const COLORS = [
  "#2FF5DE",
  "#3985F6",
  "#76EE58",
  "#E81543",
  "#F36E23",
  "#F454B4",
  "#F7D421"
];

export const getColor = (index: number): string => {
  if (index >= COLORS.length) return COLORS[index % COLORS.length];
  return COLORS[index];
};
